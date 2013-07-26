/**
 * The Pentaho proprietary code is licensed under the terms and conditions
 * of the software license agreement entered into between the entity licensing
 * such code and Pentaho Corporation. 
 */


doh.register("GeoClient  Tests", [

    {  name: "1. Test Package",
        runTest: function(){
        
            doh.assertTrue( pentaho.geo );    
        }
    },

    {  name: "2. Test Functions",
        runTest: function(){
        
            doh.assertTrue( pentaho.geo.createAddress );    
            doh.assertTrue( pentaho.geo.getCentroids );    
        }
    },
    
    {  name: "3. Test createAddress simple",
        runTest: function(){

            var address = pentaho.geo.createAddress({'Country':'Canada'},'Country');
        
            doh.assertTrue( address['class'] == 'com.pentaho.geo.model.Address' );    
            doh.assertTrue( address.type == 'Country' );    
            doh.assertTrue( address.elements.length == 1 );    
            doh.assertTrue( address.elements[0]['class'] == 'com.pentaho.geo.model.PlaceElement' );    
            doh.assertTrue( address.elements[0].type == 'Country' );    
            doh.assertTrue( address.elements[0].value == 'Canada' );    
        }
    },
    
    {  name: "4. Test createAddress complex",
        runTest: function(){

            var address = pentaho.geo.createAddress({'Municipality':'London','Country': 'United Kingdom'},'Municipality');
        
            doh.assertTrue( address['class'] == 'com.pentaho.geo.model.Address' );    
            doh.assertTrue( address.type == 'Municipality' );    
            doh.assertTrue( address.elements.length == 2 );    
            doh.assertTrue( address.elements[0]['class'] == 'com.pentaho.geo.model.PlaceElement' );    
            doh.assertTrue( address.elements[1]['class'] == 'com.pentaho.geo.model.PlaceElement' );
            if(address.elements[0].type == 'Country') {     
                doh.assertTrue( address.elements[0].type == 'Country' );    
                doh.assertTrue( address.elements[0].value == 'United Kingdom' );    
            } else {
                doh.assertTrue( address.elements[1].type == 'Country' );    
                doh.assertTrue( address.elements[1].value == 'United Kingdom' );    
            }
            if(address.elements[0].type == 'Municipality') {     
                doh.assertTrue( address.elements[0].type == 'Municipality' );    
                doh.assertTrue( address.elements[0].value == 'London' );    
            } else {
                doh.assertTrue( address.elements[1].type == 'Municipality' );    
                doh.assertTrue( address.elements[1].value == 'London' );    
            }
        }
    },

    {  name: "5. Test getCentroids - no caching",
        runTest: function(){

            var addresses = [
                pentaho.geo.createAddress({'Country':'Canada'},'Country'),
                pentaho.geo.createAddress({'Country':'France'},'Country'),
                pentaho.geo.createAddress({'Country':'Germany'},'Country')
            ];

            var result = pentaho.geo.getCentroids('Country', addresses, null, false);
            doh.assertTrue( result.length > 100 );
            var geocoded = null;
            try {
                geocoded = eval ('('+result+')');
            } catch (e) {}
            doh.assertTrue( geocoded != null );
            doh.assertTrue( geocoded['class'] == 'com.pentaho.geo.model.GeoJsonFeatureCollection')
            doh.assertTrue( geocoded.type == 'FeatureCollection')
            doh.assertTrue( geocoded.features.length == 3)

            doh.assertTrue( geocoded.features[0]['class'] == 'com.pentaho.geo.model.GeoJsonFeature' );
            doh.assertTrue( geocoded.features[0].type == 'Feature' );
            doh.assertTrue( geocoded.features[0].geometry['class'] == 'com.pentaho.geo.model.GeoJsonPointGeometry' );
            doh.assertTrue( geocoded.features[0].geometry.type == 'Point' );
            doh.assertTrue( geocoded.features[0].geometry.coordinates.length == 2 );
            doh.assertTrue( geocoded.features[0].properties.Country == 'Canada' );
            doh.assertTrue( geocoded.features[1].properties.Country == 'France' );
            doh.assertTrue( geocoded.features[2].properties.Country == 'Germany' );
            
            /*
{"class":"com.pentaho.geo.model.GeoJsonFeatureCollection","features":[{"class":"com.pentaho.geo.model.GeoJsonFeature","geometry":{"class":"com.pentaho.geo.model.GeoJsonPointGeometry","coordinates":[-110.442055415,56.8362426758],"type":"Point"},"properties":{"CountryCode":"CA","CountryCode3":"CAN","Country":"Canada"},"type":"Feature"},{"class":"com.pentaho.geo.model.GeoJsonFeature","geometry":{"class":"com.pentaho.geo.model.GeoJsonPointGeometry","coordinates":[2.19452385044,46.7118034363],"type":"Point"},"properties":{"CountryCode":"FR","CountryCode3":"FRA","Country":"France"},"type":"Feature"},{"class":"com.pentaho.geo.model.GeoJsonFeature","geometry":{"class":"com.pentaho.geo.model.GeoJsonPointGeometry","coordinates":[10.5471075946,51.1638870239],"type":"Point"},"properties":{"CountryCode":"DE","CountryCode3":"DEU","Country":"Germany"},"type":"Feature"}],"type":"FeatureCollection"}
            */
            
        }
    },

    {  name: "6. Test getCentroids - from cache",
        runTest: function(){
            // force into the cache
            var cachedJson = '{"class":"com.pentaho.geo.model.GeoJsonFeatureCollection","features":[{"class":"com.pentaho.geo.model.GeoJsonFeature","geometry":{"class":"com.pentaho.geo.model.GeoJsonPointGeometry","coordinates":[-110.442055415,56.8362426758],"type":"Point"},"properties":{"CountryCode":"CA","CountryCode3":"CAN","Country":"Canada"},"type":"Feature"},{"class":"com.pentaho.geo.model.GeoJsonFeature","geometry":{"class":"com.pentaho.geo.model.GeoJsonPointGeometry","coordinates":[2.19452385044,46.7118034363],"type":"Point"},"properties":{"CountryCode":"FR","CountryCode3":"FRA","Country":"France"},"type":"Feature"},{"class":"com.pentaho.geo.model.GeoJsonFeature","geometry":{"class":"com.pentaho.geo.model.GeoJsonPointGeometry","coordinates":[10.5471075946,51.1638870239],"type":"Point"},"properties":{"CountryCode":"DE","CountryCode3":"DEU","Country":"Germany"},"type":"Feature"}],"type":"FeatureCollection"}';
            // override the cache prefix for testing
            GEO_PREFIX = "pentaho_geo_TESTING_";

            // let's clear the cache for the first round. make sure the results get cached
            pentaho.common.localcache.clear(GEO_PREFIX + "Country");
            pentaho.common.localcache.putValue(GEO_PREFIX + "Country", eval('(' + cachedJson + ')'));

            var addresses = [
                pentaho.geo.createAddress({'Country':'Canada'},'Country'),
                pentaho.geo.createAddress({'Country':'France'},'Country'),
                pentaho.geo.createAddress({'Country':'Germany'},'Country')
            ];

            var dohDeferred = new doh.Deferred();
            var callback = function(result) {
              doh.assertTrue( result.length > 100 );
              var geocoded = null;
              try {
                  geocoded = eval ('('+result+')');
              } catch (e) {}
              doh.assertTrue( geocoded != null );
              doh.assertTrue( geocoded['class'] == 'com.pentaho.geo.model.GeoJsonFeatureCollection')
              doh.assertTrue( geocoded.type == 'FeatureCollection')
              doh.assertTrue( geocoded.features.length == 3)

              doh.assertTrue( geocoded.features[0]['class'] == 'com.pentaho.geo.model.GeoJsonFeature' );
              doh.assertTrue( geocoded.features[0].type == 'Feature' );
              doh.assertTrue( geocoded.features[0].geometry['class'] == 'com.pentaho.geo.model.GeoJsonPointGeometry' );
              doh.assertTrue( geocoded.features[0].geometry.type == 'Point' );
              doh.assertTrue( geocoded.features[0].geometry.coordinates.length == 2 );
              doh.assertTrue( geocoded.features[0].properties.Country == 'Canada' );
              doh.assertTrue( geocoded.features[1].properties.Country == 'France' );
              doh.assertTrue( geocoded.features[2].properties.Country == 'Germany' );

              var cachedCentroids = pentaho.common.localcache.getValue(GEO_PREFIX + "Country");
              doh.assertEqual(3, cachedCentroids.features.length);

              dohDeferred.callback(true);
            }
            var result = pentaho.geo.getCentroids('Country', addresses, callback, true);

            return dohDeferred;
            /*
  {"class":"com.pentaho.geo.model.GeoJsonFeatureCollection","features":[{"class":"com.pentaho.geo.model.GeoJsonFeature","geometry":{"class":"com.pentaho.geo.model.GeoJsonPointGeometry","coordinates":[-110.442055415,56.8362426758],"type":"Point"},"properties":{"CountryCode":"CA","CountryCode3":"CAN","Country":"Canada"},"type":"Feature"},{"class":"com.pentaho.geo.model.GeoJsonFeature","geometry":{"class":"com.pentaho.geo.model.GeoJsonPointGeometry","coordinates":[2.19452385044,46.7118034363],"type":"Point"},"properties":{"CountryCode":"FR","CountryCode3":"FRA","Country":"France"},"type":"Feature"},{"class":"com.pentaho.geo.model.GeoJsonFeature","geometry":{"class":"com.pentaho.geo.model.GeoJsonPointGeometry","coordinates":[10.5471075946,51.1638870239],"type":"Point"},"properties":{"CountryCode":"DE","CountryCode3":"DEU","Country":"Germany"},"type":"Feature"}],"type":"FeatureCollection"}
            */

        }
    },
    {  name: "7. Test getCentroids - multiple calls, some cached",
        runTest: function(){
            // override the cache prefix for testing
            GEO_PREFIX = "pentaho_geo_TESTING_";

            // let's clear the cache for the first round. make sure the results get cached
            pentaho.common.localcache.clear(GEO_PREFIX + "Country");

            var addresses = [
                pentaho.geo.createAddress({'Country':'Canada'},'Country'),
                pentaho.geo.createAddress({'Country':'France'},'Country'),
                pentaho.geo.createAddress({'Country':'Germany'},'Country')
            ];

            var dohDeferred = new doh.Deferred();
            var callback = function(result) {
              doh.assertTrue( result.length > 100 );
              var geocoded = null;
              try {
                  geocoded = eval ('('+result+')');
              } catch (e) {}
              doh.assertTrue( geocoded != null );
              doh.assertTrue( geocoded['class'] == 'com.pentaho.geo.model.GeoJsonFeatureCollection')
              doh.assertTrue( geocoded.type == 'FeatureCollection')
              doh.assertTrue( geocoded.features.length == 3)

              doh.assertTrue( geocoded.features[0]['class'] == 'com.pentaho.geo.model.GeoJsonFeature' );
              doh.assertTrue( geocoded.features[0].type == 'Feature' );
              doh.assertTrue( geocoded.features[0].geometry['class'] == 'com.pentaho.geo.model.GeoJsonPointGeometry' );
              doh.assertTrue( geocoded.features[0].geometry.type == 'Point' );
              doh.assertTrue( geocoded.features[0].geometry.coordinates.length == 2 );
              doh.assertTrue( geocoded.features[0].properties.Country == 'Canada' );
              doh.assertTrue( geocoded.features[1].properties.Country == 'France' );
              doh.assertTrue( geocoded.features[2].properties.Country == 'Germany' );

              var cachedCentroids = pentaho.common.localcache.getValue(GEO_PREFIX + "Country");
              doh.assertEqual(3, cachedCentroids.features.length);

              // now lets add an address to go get,
              addresses.push(pentaho.geo.createAddress({ 'Country': 'Italy' }, 'Country'));
              var callback2 = function(result) {
                doh.assertTrue( result.length > 100 );
                var geocoded = null;
                try {
                    geocoded = eval ('('+result+')');
                } catch (e) {}

                // items found in the cache are appended to the ones returned from the service call
                doh.assertTrue( geocoded.features[0].properties.Country == 'Italy' );
                doh.assertTrue( geocoded.features[1].properties.Country == 'Canada' );
                doh.assertTrue( geocoded.features[2].properties.Country == 'France' );
                doh.assertTrue( geocoded.features[3].properties.Country == 'Germany' );

                // make sure that the new item got cached
                var cachedCentroids = pentaho.common.localcache.getValue(GEO_PREFIX + "Country");
                doh.assertEqual(4, cachedCentroids.features.length);
                dohDeferred.callback(true);
              }
              var result2 = pentaho.geo.getCentroids('Country', addresses, callback2, true);

            }
            var result = pentaho.geo.getCentroids('Country', addresses, callback, true);

            return dohDeferred;
            /*
  {"class":"com.pentaho.geo.model.GeoJsonFeatureCollection","features":[{"class":"com.pentaho.geo.model.GeoJsonFeature","geometry":{"class":"com.pentaho.geo.model.GeoJsonPointGeometry","coordinates":[-110.442055415,56.8362426758],"type":"Point"},"properties":{"CountryCode":"CA","CountryCode3":"CAN","Country":"Canada"},"type":"Feature"},{"class":"com.pentaho.geo.model.GeoJsonFeature","geometry":{"class":"com.pentaho.geo.model.GeoJsonPointGeometry","coordinates":[2.19452385044,46.7118034363],"type":"Point"},"properties":{"CountryCode":"FR","CountryCode3":"FRA","Country":"France"},"type":"Feature"},{"class":"com.pentaho.geo.model.GeoJsonFeature","geometry":{"class":"com.pentaho.geo.model.GeoJsonPointGeometry","coordinates":[10.5471075946,51.1638870239],"type":"Point"},"properties":{"CountryCode":"DE","CountryCode3":"DEU","Country":"Germany"},"type":"Feature"}],"type":"FeatureCollection"}
            */

        }
    },
    
    { name: "Test Cache Helper.getCachedCentroids - complex",
      runTest: function() {
        var helper = pentaho.geo.getCacheHelper("CountrySubdivision");
        var cachedJson = '{"class":"com.pentaho.geo.model.GeoJsonFeatureCollection","features":[{"class":"com.pentaho.geo.model.GeoJsonFeature","geometry":{"class":"com.pentaho.geo.model.GeoJsonPointGeometry","coordinates":[14.3806934,-5.1694746],"type":"Point"},"properties":{"CountrySubdivision":"Bas-Congo","CountrySubdivisionCode":"BC","CountryCode3":"COD","CountryCode":"CD","Country":"CONGO (KINSHASA)"},"type":"Feature"},{"class":"com.pentaho.geo.model.GeoJsonFeature","geometry":{"class":"com.pentaho.geo.model.GeoJsonPointGeometry","coordinates":[-119.993988,37.2690353],"type":"Point"},"properties":{"CountrySubdivision":"California","CountrySubdivisionCode":"CA","CountryCode3":"USA","CountryCode":"US","Country":"UNITED STATES"},"type":"Feature"},{"class":"com.pentaho.geo.model.GeoJsonFeature","geometry":{"class":"com.pentaho.geo.model.GeoJsonPointGeometry","coordinates":[-72.6633949,41.5228157],"type":"Point"},"properties":{"CountrySubdivision":"Connecticut","CountrySubdivisionCode":"CT","CountryCode3":"USA","CountryCode":"US","Country":"UNITED STATES"},"type":"Feature"},{"class":"com.pentaho.geo.model.GeoJsonFeature","geometry":{"class":"com.pentaho.geo.model.GeoJsonPointGeometry","coordinates":[-1.3378704,50.6755219],"type":"Point"},"properties":{"CountrySubdivision":"Isle of Wight","CountryCode3":"GBR","CountryCode":"GB","Country":"UNITED KINGDOM"},"type":"Feature"},{"class":"com.pentaho.geo.model.GeoJsonFeature","geometry":{"class":"com.pentaho.geo.model.GeoJsonPointGeometry","coordinates":[-72.0905037,42.1898727],"type":"Point"},"properties":{"CountrySubdivision":"Massachusetts","CountrySubdivisionCode":"MA","CountryCode3":"USA","CountryCode":"US","Country":"UNITED STATES"},"type":"Feature"},{"class":"com.pentaho.geo.model.GeoJsonFeature","geometry":{"class":"com.pentaho.geo.model.GeoJsonPointGeometry","coordinates":[-116.6600533,38.4978275],"type":"Point"},"properties":{"CountrySubdivision":"Nevada","CountrySubdivisionCode":"NV","CountryCode3":"USA","CountryCode":"US","Country":"UNITED STATES"},"type":"Feature"},{"class":"com.pentaho.geo.model.GeoJsonFeature","geometry":{"class":"com.pentaho.geo.model.GeoJsonPointGeometry","coordinates":[-71.6442719,43.5871067],"type":"Point"},"properties":{"CountrySubdivision":"New Hampshire","CountrySubdivisionCode":"NH","CountryCode3":"USA","CountryCode":"US","Country":"UNITED STATES"},"type":"Feature"},{"class":"com.pentaho.geo.model.GeoJsonFeature","geometry":{"class":"com.pentaho.geo.model.GeoJsonPointGeometry","coordinates":[-74.7335815,40.7510586],"type":"Point"},"properties":{"CountrySubdivision":"New Jersey","CountrySubdivisionCode":"NJ","CountryCode3":"USA","CountryCode":"US","Country":"UNITED STATES"},"type":"Feature"},{"class":"com.pentaho.geo.model.GeoJsonFeature","geometry":{"class":"com.pentaho.geo.model.GeoJsonPointGeometry","coordinates":[-76.0827026,42.8549995],"type":"Point"},"properties":{"CountrySubdivision":"New York","CountrySubdivisionCode":"NY","CountryCode3":"USA","CountryCode":"US","Country":"UNITED STATES"},"type":"Feature"},{"class":"com.pentaho.geo.model.GeoJsonFeature","geometry":{"class":"com.pentaho.geo.model.GeoJsonPointGeometry","coordinates":[4.9402053,52.6713715],"type":"Point"},"properties":{"CountrySubdivision":"Noord-Holland","CountrySubdivisionCode":"NH","CountryCode3":"NLD","CountryCode":"NL","Country":"NETHERLANDS"},"type":"Feature"},{"class":"com.pentaho.geo.model.GeoJsonFeature","geometry":{"class":"com.pentaho.geo.model.GeoJsonPointGeometry","coordinates":[-77.8229256,40.9932518],"type":"Point"},"properties":{"CountrySubdivision":"Pennsylvania","CountrySubdivisionCode":"PA","CountryCode3":"USA","CountryCode":"US","Country":"UNITED STATES"},"type":"Feature"}],"type":"FeatureCollection"}';
        GEO_PREFIX = "pentaho_geo_TESTING_";

        // let's clear the cache for the first round. make sure the results get cached
        pentaho.common.localcache.clear(GEO_PREFIX + "CountrySubdivision");
        pentaho.common.localcache.putValue(GEO_PREFIX + "CountrySubdivision", eval('(' + cachedJson + ')'));

        var addresses = [
            pentaho.geo.createAddress({'Country':'USA', CountryCode: 'USA', CountryCode3: 'USA', 'CountrySubdivision': 'CA', CountrySubdivisionCode: 'CA'},'CountrySubdivision')
//            pentaho.geo.createAddress({'Country':'USA', 'CountrySubdivision': 'MA'},'CountrySubdivision')
        ];

        var results = pentaho.geo.getCachedCentroids('CountrySubdivision', addresses);
        doh.assertEqual(1, results.length);
      }

    },

    { name: "Test CacheHelper.compare - primary types",
      runTest: function() {
        var helper = pentaho.geo.getCacheHelper("CountrySubdivision");

        var address = pentaho.geo.createAddress(
            { 'Country': 'USA',
              'CountrySubdivision': 'FL' },
            'CountrySubdivision' );

        var feature = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
                        type: 'Feature',
                        geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
                        properties: { Country: "USA", CountrySubdivision: "FL"}
                      };

        var result = helper.compare(feature, address);
        doh.assertEqual(0, result); // FL == FL


        address = pentaho.geo.createAddress(
            { 'Country': 'USA',
              'CountrySubdivision': 'WA' },
            'CountrySubdivision' );

        var result = helper.compare(feature, address);
        doh.assertEqual(1, result); // WA > FL


        address = pentaho.geo.createAddress(
            { 'Country': 'USA',
              'CountrySubdivision': 'AL' },
            'CountrySubdivision' );

        var result = helper.compare(feature, address);
        doh.assertEqual(-1, result); // AL < FL

      }

    },

    { name: "Test CacheHelper.compare - secondary types",
      runTest: function() {
        // make sure secondary elements are accounted for when comparing
        var helper = pentaho.geo.getCacheHelper("Municipality");
        var address = pentaho.geo.createAddress(
            { 'Country': 'UK',
              'Municipality': 'London' },
            'Municipality' );

        var feature = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
                    type: 'Feature',
                    geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
                    properties: { Country: "CA", Municipality: "London"}
                  };

        var result = helper.compare(feature, address);
        doh.assertEqual(1, result); // London == London, but UK > CA

        address = pentaho.geo.createAddress(
            { 'Country': 'CA',
              'Municipality': 'London' },
            'Municipality' );

        var result = helper.compare(feature, address);
        doh.assertEqual(0, result); // London == London and  CA == CA

        address = pentaho.geo.createAddress(
            { 'Country': 'BE',
              'Municipality': 'London' },
            'Municipality' );

        var result = helper.compare(feature, address);
        doh.assertEqual(-1, result); // London == London, but BE < CA
      }

    },

    { name: "Test CacheHelper.compare - code fields",
      runTest: function() {
        // make sure secondary elements are accounted for when comparing
        var helper = pentaho.geo.getCacheHelper("CountrySubdivision");
        var address = pentaho.geo.createAddress(
            { 'Country': 'USA', 'CountrySubdivision': 'CA' },
            'Municipality' );

        var feature = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
                    type: 'Feature',
                    geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
                    properties: { Country: "United States", CountryCode: 'US', CountryCode3: 'USA',
                      CountrySubdivision: "California", CountrySubdivisionCode: 'CA'}
                  };

        var result = helper.compare(feature, address, 'CountrySubdivisionCode');
        doh.assertEqual(0, result); // CA ~ California London, USA ~ United States
      }
    },


    { name: "Test CacheHelper.compare - tertiary types",
      runTest: function() {
        // make sure tertiary elements are accounted for when comparing
        var helper = pentaho.geo.getCacheHelper("Municipality");
        var address = pentaho.geo.createAddress(
            { 'Country': 'USA',
              'CountrySubdivision': 'PA',
              'Municipality': 'London' },
            'Municipality' );

        var feature = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
                    type: 'Feature',
                    geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
                    properties: { Country: "USA", CountrySubdivision: "OH", Municipality: "London"}
                  };

        var result = helper.compare(feature, address);
        doh.assertEqual(1, result); // London == London, USA == USA, but PA > OH

        address = pentaho.geo.createAddress(
            { 'Country': 'USA',
              'CountrySubdivision': 'OH',
              'Municipality': 'London' },
            'Municipality' );

        var result = helper.compare(feature, address);
        doh.assertEqual(0, result); // London == London, USA = USA, and OH == OH

        address = pentaho.geo.createAddress(
            { 'Country': 'USA',
              'CountrySubdivision': 'MI',
              'Municipality': 'London' },
            'Municipality' );

        var result = helper.compare(feature, address);
        doh.assertEqual(-1, result); // London == London, USA == USA, but MI < OH
      }

    },

    { name: "Test CacheHelper.compareFeatures - primary types",
      runTest: function() {
        var helper = pentaho.geo.getCacheHelper("Country");

        var feature1 = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
                    type: 'Feature',
                    geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
                    properties: { Country: "United States", CountryCode: "US", CountryCode3: "USA" }
                  };
        var feature2 = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
                    type: 'Feature',
                    geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
                    properties: { Country: "United States" }
                  };

        var result = helper.compareFeatures(feature1, feature2);
        doh.assertEqual(0, result);

        feature2 = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
                    type: 'Feature',
                    geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
                    properties: { Country: "Canada" }
                  };

        result = helper.compareFeatures(feature1, feature2);
        doh.assertEqual(-1, result);

        feature2 = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
                    type: 'Feature',
                    geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
                    properties: { Country: "Zimbabwe" }
                  };

        result = helper.compareFeatures(feature1, feature2);
        doh.assertEqual(1, result);

        feature2 = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
                    type: 'Feature',
                    geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
                    properties: { CountryCode: "US" }
                  };

        result = helper.compareFeatures(feature1, feature2, "CountryCode");
        doh.assertEqual(0, result);
      }
    },

    { name: "Test CacheHelper.compareFeatures - uniqueness based on parent types",
      runTest: function() {
        var helper = pentaho.geo.getCacheHelper("Municipality");

        var feature1 = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
                    type: 'Feature',
                    geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
                    properties: { Country: "United States", CountrySubdivision: "OH", Municipality: "London" }
                  };
        var feature2 = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
                    type: 'Feature',
                    geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
                    properties: { Country: "United States", CountrySubdivision: "OH", Municipality: "London" }
                  };

        var result = helper.compareFeatures(feature1, feature2);
        doh.assertEqual(0, result);

        feature2 = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
                    type: 'Feature',
                    geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
                    properties: { Country: "Canada", CountrySubdivision: "ON", Municipality: "London" }
                  };

        result = helper.compareFeatures(feature1, feature2);
        doh.assertEqual(-1, result); // London == London, Canada < United States

        feature2 = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
                    type: 'Feature',
                    geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
                    properties: { Country: "United States", CountrySubdivision: "MI", Municipality: "London" }
                  };

        result = helper.compareFeatures(feature1, feature2);
        doh.assertEqual(-1, result); // London == London, United States == United States, MI < OH

        feature2 = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
                    type: 'Feature',
                    geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
                    properties: { Country: "United States", CountrySubdivision: "PA", Municipality: "London" }
                  };

        result = helper.compareFeatures(feature1, feature2);
        doh.assertEqual(1, result); // London == London, United States == United States, PA > OH

        feature2 = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
                    type: 'Feature',
                    geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
                    properties: { Country: "ZZZ", CountrySubdivision: "OH", Municipality: "London" }
                  };

        result = helper.compareFeatures(feature1, feature2);
        doh.assertEqual(1, result); // London == London, ZZZ > United States
      }
    },

    { name: "Test CacheHelper.find",
      runTest: function() {
        var sortedFeatures = getSortedFeatures();
        var helper = pentaho.geo.getCacheHelper("Municipality");

        var feature = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
                    type: 'Feature',
                    geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
                    properties: { Country: "United Kingdom", Municipality: "London" }
                  };

        var result = helper.find(sortedFeatures, feature);
        doh.assertEqual(1, result);

        feature = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
                    type: 'Feature',
                    geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
                    properties: { Country: "United States", Municipality: "Miami" }
                  };
        result = helper.find(sortedFeatures, feature);
        doh.assertEqual(3, result);

        feature = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
                    type: 'Feature',
                    geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
                    properties: { Country: "ZZZZZZZ", Municipality: "Miami" }
                  };
        result = helper.find(sortedFeatures, feature);
        doh.assertEqual(4, result);

        feature = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
                    type: 'Feature',
                    geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
                    properties: { Country: "XXXXXXX", Municipality: "Miami" }
                  };
        result = helper.find(sortedFeatures, feature);
        doh.assertEqual(-1, result);

        feature = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
                    type: 'Feature',
                    geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
                    properties: { Municipality: "Chicago" }
                  };
        result = helper.find(sortedFeatures, feature);
        doh.assertEqual(0, result);

        feature = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
                    type: 'Feature',
                    geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
                    properties: { CountrySubdivision: "FL", Municipality: "Tampa Bay" }
                  };
        result = helper.find(sortedFeatures, feature);
        doh.assertEqual(6, result);
      }
    },

    { name: "Test CacheHelper.search",
      runTest: function() {
        var sortedFeatures = getSortedFeatures();
        var helper = pentaho.geo.getCacheHelper("Municipality");

        var address = pentaho.geo.createAddress(
            { 'Country': 'United Kingdom',
              'Municipality': 'London' },
            'Municipality' );

        var result = helper.search(sortedFeatures, address);
        doh.assertEqual(1, result);

        address = pentaho.geo.createAddress(
            { 'Country': 'United States',
              'Municipality': 'Miami' },
            'Municipality' );

        result = helper.search(sortedFeatures, address);
        doh.assertEqual(3, result);

        address = pentaho.geo.createAddress(
            { 'Country': 'ZZZZZZZ',
              'Municipality': 'Miami' },
            'Municipality' );

        result = helper.search(sortedFeatures, address);
        doh.assertEqual(4, result);

        address = pentaho.geo.createAddress(
            { 'Country': 'PPPPPPPP',
              'Municipality': 'Miami' },
            'Municipality' );

        result = helper.search(sortedFeatures, address);
        doh.assertEqual(-1, result);

        address = pentaho.geo.createAddress(
            { 'Municipality': 'Chicago' },
            'Municipality' );

        result = helper.search(sortedFeatures, address);
        doh.assertEqual(0, result);

        address = pentaho.geo.createAddress(
            { 'Municipality': 'Tampa Bay',
              'CountrySubdivision': 'FL'},
            'Municipality' );

        result = helper.search(sortedFeatures, address);
        doh.assertEqual(6, result);
      }
    }
    ]
);

function getSortedFeatures() {
  var features = [];

  var feature0 = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
              type: 'Feature',
              geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
              properties: { Country: "United States", Municipality: "Chicago" }
            };
  var feature1 = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
              type: 'Feature',
              geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
              properties: { Country: "United Kingdom", Municipality: "London" }
            };
  var feature2 = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
              type: 'Feature',
              geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
              properties: { Country: "AAAAAA", Municipality: "Miami" }
            };
  var feature3 = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
              type: 'Feature',
              geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
              properties: { Country: "United States", Municipality: "Miami" }
            };
  var feature4 = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
              type: 'Feature',
              geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
              properties: { Country: "ZZZZZZZ", Municipality: "Miami" }
            };
  var feature5 = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
              type: 'Feature',
              geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
              properties: { Country: "United States", Municipality: "Orlando" }
            };
  var feature6 = { "class": 'com.pentaho.geo.model.GeoJsonFeature',
              type: 'Feature',
              geometry: { "class": 'com.pentaho.geo.model.GeoJsonPointGeometry', type: 'Point'},
              properties: { Country: "United States", Municipality: "Tampa Bay" }
            };

  features.push(feature0);
  features.push(feature1);
  features.push(feature2);
  features.push(feature3);
  features.push(feature4);
  features.push(feature5);
  features.push(feature6);

  return features;
}

