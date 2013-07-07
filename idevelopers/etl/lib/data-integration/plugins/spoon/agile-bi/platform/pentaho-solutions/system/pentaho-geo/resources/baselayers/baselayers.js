
/*
    You can edit this file to set the base map layers that you want to be available to users.
    You can mix and match map layers from different providers.
    The order that the Layer objects are created below is the order they will appear UI the layer switcher UI
    Some map layers (Google, Yahoo etc) require additional imports 
*/

pentaho = typeof pentaho == "undefined" ? {} : pentaho;

pentaho.openlayers = pentaho.openlayers || {};

// Start Google Maps libraries
document.write('<script src="http://maps.google.com/maps/api/js?v=3.5&sensor=false"></script>');
// End Google Maps libraries 

// Start Yahoo Maps libraries

// ** uncomment if you want to use Yahoo! maps (also need to add it in below in getMapLayers as a layer)
//document.write('<script src="http://api.maps.yahoo.com/ajaxymap?v=3.0&appid=euzuro-openlayers"></script>');

// End Yahoo Maps libraries

pentaho.openlayers.getMapLayers = function(provider) {
    pentaho.geo.baselayers = [];


    pentaho.geo.baselayers.push( 
      new OpenLayers.Layer.Google(
          "Google Physical",
          {'sphericalMercator': true, type: google.maps.MapTypeId.TERRAIN}
      )
    );

    pentaho.geo.baselayers.push( 
      new OpenLayers.Layer.Google(
          "Google Streets", // the default
          {'sphericalMercator': true, numZoomLevels: 20}
      )
    );

    pentaho.geo.baselayers.push( 
      new OpenLayers.Layer.Google(
          "Google Hybrid",
          {'sphericalMercator': true, type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
      )
    );

    pentaho.geo.baselayers.push( 
      new OpenLayers.Layer.Google(
          "Google Satellite",
          {'sphericalMercator': true, type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
      )
    );
    
    /*
    pentaho.geo.baselayers.push( 
        new OpenLayers.Layer.Bing({
            key: "",
            type: "Road"
        })
    );

    pentaho.geo.baselayers.push( 
        new OpenLayers.Layer.Bing({
            key: "",
            type: "Aerial"
        })
    );

    pentaho.geo.baselayers.push( 
        new OpenLayers.Layer.Bing({
            key: "",
            type: "AerialWithLabels",
            name: "Bing Aerial With Labels"
        })
    );
    
    pentaho.geo.baselayers.push( 
        new OpenLayers.Layer.Yahoo( "Yahoo")
    );
    */
    pentaho.geo.baselayers.push( 
        new OpenLayers.Layer.OSM("Open Street Maps")
    );
    /*
    pentaho.geo.baselayers.push( 
        new OpenLayers.Layer.WMS(
              "OpenLayers WMS",
              "http://vmap0.tiles.osgeo.org/wms/vmap0",
              {layers: 'basic'}
          )
    );

    pentaho.geo.baselayers.push( 
        new OpenLayers.Layer.OSM("MapQuest-OSM Tiles", [
            "http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
            "http://otile2.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
            "http://otile3.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
            "http://otile4.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png"])
    );

    pentaho.geo.baselayers.push( 
        new OpenLayers.Layer.OSM("MapQuest Open Aerial Tiles", [
            "http://oatile1.mqcdn.com/naip/${z}/${x}/${y}.png",
            "http://oatile2.mqcdn.com/naip/${z}/${x}/${y}.png",
            "http://oatile3.mqcdn.com/naip/${z}/${x}/${y}.png",
            "http://oatile4.mqcdn.com/naip/${z}/${x}/${y}.png"])
    );
*/

    return pentaho.geo.baselayers;
}

