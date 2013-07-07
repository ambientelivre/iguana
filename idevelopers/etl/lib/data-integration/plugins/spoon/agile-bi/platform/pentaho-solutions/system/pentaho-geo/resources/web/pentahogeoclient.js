pentaho = typeof pentaho == "undefined" ? {} : pentaho;

pentaho.geo = {};

pentaho.geo.createAddress = function( elementMap, type ) {

    var address = {
        "class":"com.pentaho.geo.model.Address",
        elements:[],
        type:type    
    };

    var nullValue = "";
    if (typeof cvCatalog != 'undefined') {
      nullValue = cvCatalog.attributeNullValue;
    }

    var val;
    for( type in elementMap ) {
      val = elementMap[type] == nullValue ? null : elementMap[type];
      if (elementMap)
        var element = {
            "class":"com.pentaho.geo.model.PlaceElement",
            type:type,
            value: val
        };
        address.elements.push(element);
    }
    return address;
}

pentaho.geo.getCentroids = function( type, addresses, callback, cachingOn ) {
    console.log("Getting centroids for " + addresses.length + " " + type + " locations");

    var doCache = (cachingOn == undefined || cachingOn == true) ? true : false;

    if(doCache) {
      // look in the local cache for the centroids first
      var cached = pentaho.geo.getCachedCentroids(type, addresses);
    }

    // any addresses that were found in the cache, don't send to the service for lookup
    if(cached != 'undefined' && cached != null && cached.length > 0) {
      for(var i = 0; i < cached.length; i++) {
        // remove this address from the ones we will lookup from the service
        var idx = addresses.indexOf(cached[i].address);
        if(idx != -1) {
          addresses.splice(idx, 1);  // remove it
        }
      }
    }

    if(addresses.length > 0) {

      console.log("Calling the geo service to lookup " + addresses.length + " " + type + " locations");
      var request = {
          "class": "com.pentaho.geo.model.GeocodeRequest",
          address: addresses
      }

      var json;
      try {
          json = dojo.toJson(request);
      } catch (e) {
          // try a different version of Dojo
          json = dojo.json.serialize(request);
      }
  //    alert(json)
      var query = 'feature=centroids&format=geojson&json='+json

      if(doCache) {
        // submit the request to the server
        var callbackInterceptor = {
          method: pentaho.geo.cacheCentroidResults,
          obj: {callback: callback, type: type, cachedFeatures: cached}
        }
        var result = pentahoPost(CONTEXT_PATH+'content/geojson', query, callbackInterceptor, 'application/json');
        if(result == null) {
          result = '{"class":"com.pentaho.geo.model.GeoJsonFeatureCollection", features: [], type:"FeatureCollection"}';
        }
        return result;
      } else {
        var result = pentahoPost(CONTEXT_PATH+'content/geojson', query, callback, 'application/json');
        return result;
      }
    } else {
      // everything was in the cache, don't hit the server
      var obj = {callback: callback, type: type, cachedFeatures: cached};
      var json = '{"class":"com.pentaho.geo.model.GeoJsonFeatureCollection", features: [], type:"FeatureCollection"}';
      var method = pentaho.geo.cacheCentroidResults;
      try {
        var result = method.call(obj, json);
        return result;
      } catch (ex) {
        console.log(ex);
      }
    }

}

pentaho.geo.cacheCentroidResults = function (json) {
  if(typeof json == 'undefined' || json == null) {
    var response = {"class":"com.pentaho.geo.model.GeoJsonFeatureCollection", features: [], type:"FeatureCollection"};
  } else {
    var response = eval('('+json+')');
    if(response.code && response.code.startsWith("ERROR_")) {
      alert(response.message);
      return;
    }
  }
  var type = this.type;
  var cachedCentroids = pentaho.common.localcache.getValue(GEO_PREFIX + type.toLowerCase());
  if(cachedCentroids == null) {
    cachedCentroids = {"class":"com.pentaho.geo.model.GeoJsonFeatureCollection", features: [], type:"FeatureCollection"};
  }
  var helper = pentaho.geo.getCacheHelper(type);

  var countAdded = 0;
  // already have some values cached, add the new ones to the cache
  for(var i = 0; i < response.features.length; i++) {
    var f = response.features[i];
    if(helper.find(cachedCentroids.features, f) == -1) {
      cachedCentroids.features.push(f);
      countAdded++;
    }
  }

  console.log("Adding " + countAdded + " " + type + " locations to the cache");

  // sort the cache so future lookups can use a binary search
  if(cachedCentroids != null && cachedCentroids.features != null && cachedCentroids.features.length > 0 && countAdded > 0) {
    cachedCentroids.features.sort( function(feature1, feature2) {
      return helper.compareFeatures(feature2, feature1);
    });

    pentaho.common.localcache.putValue(GEO_PREFIX + type.toLowerCase(), cachedCentroids);
  }

  // if any requested addresses were found in the local cache,
  // add them to the items to send back to the original callback arg
  if(this.cachedFeatures != 'undefined' && this.cachedFeatures != null && this.cachedFeatures.length > 0) {
    for(var j = 0; j < this.cachedFeatures.length; j++) {
      response.features.push(this.cachedFeatures[j].feature);
    }
  }
  var returnJson;
  try {
      returnJson = dojo.toJson(response);
  } catch (e) {
      // try a different version of Dojo
      returnJson = dojo.json.serialize(response);
  }
  console.log("Returning " + response.features.length + " " + type + " locations.");
  if(this.callback != undefined && this.callback != 'undefined') {
    this.callback(returnJson);
  }
  return returnJson;
}

var GEO_PREFIX = "pentaho_geo_";

pentaho.geo.getCachedCentroids = function (type, addresses) {

  var cachedCentroids = pentaho.common.localcache.getValue(GEO_PREFIX + type.toLowerCase());
  if(cachedCentroids == null || cachedCentroids.features.length == 0) {
    console.log("No cached " + type + " locations found.");
    return null;
  }

  var helper = pentaho.geo.getCacheHelper(type);

  var found = [];
  // iterate over the addresses that are already available in the cache
  for (var j = 0; j < addresses.length; j++) {
    var addy = addresses[j];
    if(addy.type != type) {
      continue;
    }
    var index = helper.search(cachedCentroids.features, addresses[j]);
    if(index > -1) {
      found.push({ feature: cachedCentroids.features[index], address: addy });
    }
  }
  if(found.length > 0) {
    console.log("Found " + found.length + " " + type + " locations in the local cache.");
  }
  return found;
}

/**
 * CacheHelper provides searching of feature arrays
 * @param type Primary type the CacheHelper should concern itself with
 * @param featurePropNameArray optional, array of names for the primary type (defaults to [ type ] )
 * @param featureParents optional, array of parent types that would help uniquely identify this type durring comparison (defaults to [])
 */
pentaho.geo.CacheHelper = function(type, featurePropNameArray, featureParents) {
  this.type = type;
  if(featurePropNameArray != undefined) {
    this.featurePropNameArray = featurePropNameArray;
  } else {
    this.featurePropNameArray = [type];
  }
  if(featureParents != undefined) {
    this.featureParents = featureParents;
  } else {
    this.featureParents = [];
  }
}

/**
 * Binary search for an address in a sorted array of features
 * @param sortedFeatures
 * @param address
 */
pentaho.geo.CacheHelper.prototype.search = function(sortedFeatures, address) {
  if(sortedFeatures == null || sortedFeatures.length == 0 ) {
    return -1;
  }

  for(var i = 0; i < this.featurePropNameArray.length; i++) {
    var propName = this.featurePropNameArray[i];
    var start = 0;
    var stop = sortedFeatures.length - 1;
    var middle = Math.floor((stop + start) / 2);
    var res = 0;
    while( (res = this.compare(sortedFeatures[middle], address, propName)) != 0 && start < stop ) {
      if(res < 0) {
        stop = middle - 1;
      } else if (res > 0) {
        start = middle + 1;
      }
      middle = Math.floor((stop + start) / 2);
      if(middle < 0) {
        if(i == this.featurePropNameArray.length - 1) {
          // we've exhausted our possible lookups and didn't find it
          return -1;
        } else {
          break;
        }
      }
    }
    if(res == 0) {
      return middle;
    }
  }
  return -1;
}

/**
 * Binary search for a feature in a sorted array of features
 * @param sortedFeatures
 * @param feature
 */
pentaho.geo.CacheHelper.prototype.find = function(sortedFeatures, feature) {
  if(sortedFeatures == null || sortedFeatures.length == 0 ) {
    return -1;
  }

  var start = 0;
  var stop = sortedFeatures.length - 1;
  var middle = Math.floor((stop + start) / 2);
  var res = 0;
  while( (res = this.compareFeatures(sortedFeatures[middle], feature)) != 0 && start < stop ) {
    if(res < 0) {
      stop = middle - 1;
    } else if (res > 0) {
      start = middle + 1;
    }

    middle = Math.floor((stop + start) / 2);
    if(middle < 0) {
      return -1;
    }
  }
  return (res != 0) ? -1 : middle;
}

/**
 * Compares an Address to a GeoJsonFeatures. Returns:
 *  0 if they are the same
 *  1 if the address is greater than feature1
 *  -1 if the address is less than feature1
 *
 * @param feature
 * @param address
 * @param propName optional, indicates which property of the feature to compare against the address. defaults to type set on the CacheHelper
 */
pentaho.geo.CacheHelper.prototype.compare = function(feature, address, propName) {
  // use the correct address element
  var place = "";
  var placeIndex = -1;
  for(var i = 0; i < address.elements.length; i++) {
    if(address.elements[i].type.toLowerCase() == this.type.toLowerCase()) {
      place = address.elements[i].value;
      placeIndex = i;
      continue;
    }
  }

  if(propName == undefined) {
    propName = this.type;
  }

  if( typeof(feature.properties[propName]) == 'undefined') {
    // this feature does not have that propName as an attribute, use the base type to compare against
    propName = this.type;
  }

  if( feature.properties[propName] == place ) {
    // the main address element is equal to the feature's.
    // check the others to see if it is a match or not

    if(address.elements.length == 1) {
      return 0;
    }

    for(var k = 0; k < address.elements.length; k++) {
      if(k != placeIndex) {
        var addressType = address.elements[k].type;

        if(feature.properties[addressType] != undefined) {
          // the feature defines the same geo type, compare them
          var featurePropValue = feature.properties[addressType];
          var addressValue = address.elements[k].value;

          // handle coded values in the expected full name fields
          if(featurePropValue != addressValue) {
            var subHelper = pentaho.geo.getCacheHelper(addressType);
            if(subHelper.featurePropNameArray.length > 1) {
              var found = false;
              for(var idx = 0; idx < subHelper.featurePropNameArray.length; idx++) {
                var tryType = subHelper.featurePropNameArray[idx];
                if (feature.properties[tryType] != undefined) {
                  if (feature.properties[tryType] == addressValue) {
                    found = true;
                    break;
                  }
                }
              }
              if (found) {
                continue;
              }
            }
          }

          if( featurePropValue < addressValue ) {
            return 1;
          } else if( featurePropValue > addressValue ) {
            return -1;
          }
        }
      }
    }

    return 0;

  } else if( feature.properties[propName] < place ) {
    return 1;
  } else if ( feature.properties[propName] > place ) {
    return -1
  } else {
    return 0
  }
}

/**
 * Compares 2 GeoJsonFeatures. Returns:
 *  0 if they are the same
 *  1 if feature2 is greater than feature1
 *  -1 if feature2 is less than feature1
 *
 * @param feature1 feature used as base for comparison
 * @param feature2 feature to compare to the first
 * @param type optional, used to compare non-primary properties of a feature. Defaults to type set on the CacheHelper
 */
pentaho.geo.CacheHelper.prototype.compareFeatures = function(feature1, feature2, type) {
  if(type == undefined) {
    var type = this.type;
    var inspectParents = true;
  } else {
    var type = type;
    var inspectParents = false;
  }

  if( feature1.properties[type] == feature2.properties[type] ) {
    if(inspectParents) {
      var ret = 0;
      for(var p = 0; p < this.featureParents.length; p++) {
        var parent = this.featureParents[p];
        if (feature1.properties[parent] != undefined) {
          ret = this.compareFeatures(feature1, feature2, parent);
          if(ret != 0) {
            return ret;
          }
        }
      }
    }
    return 0;
  } else if( feature1.properties[type] < feature2.properties[type] ) {
    return 1;
  } else if ( feature1.properties[type] > feature2.properties[type] ) {
    return -1
  } else {
    return 0;
  }
}

pentaho.geo.getCacheHelper = function (type) {
  if(type == "Country" || type == 'CountryCode' || type == 'CountryCode3') {
    var helper = new pentaho.geo.CacheHelper(type, ['Country', 'CountryCode', 'CountryCode3']);
  } else if(type == "CountrySubdivision" || type == "State" || type == "CountrySubdivisionCode") {
    var helper = new pentaho.geo.CacheHelper(type, ['CountrySubdivision', 'CountrySubdivisionCode'], ['Country', 'CountryCode', 'CountryCode3']);
  } else if(type == "Municipality" || type == "City") {
    var helper = new pentaho.geo.CacheHelper(type, ['Municipality'], ['Country', 'CountryCode', 'CountryCode3', 'CountrySubdivision', 'CountrySubdivisionCode']);
  } else {
    var helper = new pentaho.geo.CacheHelper(type);
  }
  return helper;
}

pentaho.geo.isMobile = function(){
  return (pentaho.geo.isMobileSafari() || window.orientation !== undefined);
}

pentaho.geo.isMobileSafari = function() {
  return navigator.userAgent.match(/(iPad|iPod|iPhone)/) != null;
}

