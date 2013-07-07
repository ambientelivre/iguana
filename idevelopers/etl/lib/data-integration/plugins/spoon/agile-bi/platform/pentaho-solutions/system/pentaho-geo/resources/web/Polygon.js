/* Copyright (c) 2006-2010 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * @requires OpenLayers/Handler/Path.js
 * @requires OpenLayers/Geometry/Polygon.js
 */

/**
 * Class: OpenLayers.Handler.Polygon
 * Handler to draw a polygon on the map.  Polygon is displayed on mouse down,
 * moves on mouse move, and is finished on mouse up.
 *
 * Inherits from:
 *  - <OpenLayers.Handler.Path>
 *  - <OpenLayers.Handler>
 */
OpenLayers.Handler.Polygon = OpenLayers.Class(OpenLayers.Handler.Path, {
    
    /**
     * Parameter: polygon
     * {<OpenLayers.Feature.Vector>}
     */
    polygon: null,

    addedFeatures: [],
    
    /**
     * Constructor: OpenLayers.Handler.Polygon
     * Create a Polygon Handler.
     *
     * Parameters:
     * control - {<OpenLayers.Control>} The control that owns this handler
     * callbacks - {Object} An object with a properties whose values are
     *     functions.  Various callbacks described below.
     * options - {Object} An optional object with properties to be set on the
     *           handler
     *
     * Named callbacks:
     * create - Called when a sketch is first created.  Callback called with
     *     the creation point geometry and sketch feature.
     * modify - Called with each move of a vertex with the vertex (point)
     *     geometry and the sketch feature.
     * point - Called as each point is added.  Receives the new point geometry.
     * done - Called when the point drawing is finished.  The callback will
     *     recieve a single argument, the polygon geometry.
     * cancel - Called when the handler is deactivated while drawing.  The
     *     cancel callback will receive a geometry.
     */
    initialize: function(control, callbacks, options) {
        OpenLayers.Handler.Path.prototype.initialize.apply(this, arguments);
    },
    
    /**
     * Method: createFeature
     * Add temporary geometries
     *
     * Parameters:
     * pixel - {<OpenLayers.Pixel>} The initial pixel location for the new
     *     feature.
     */
    createFeature: function(pixel) {
        var lonlat = this.control.map.getLonLatFromPixel(pixel);
        this.point = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat)
        );
        this.line = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.LinearRing([this.point.geometry])
        );
        this.polygon = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Polygon([this.line.geometry])
        );
        this.callback("create", [this.point.geometry, this.getSketch()]);
        this.point.geometry.clearBounds();
        this.layer.addFeatures([this.polygon, this.point], {silent: true});
        this.addedFeatures.push(this.polygon);
        this.addedFeatures.push(this.point);
    },

    /**
     * Method: destroyFeature
     * Destroy temporary geometries
     */
    destroyFeature: function() {

        this.layer.destroyFeatures(this.addedFeatures);
        this.addedFeatures = [];

        var l = this.layer;
        this.layer = null;
        OpenLayers.Handler.Path.prototype.destroyFeature.apply(this);
        this.polygon = null;
        this.layer = l;
    },

    /**
     * Method: drawFeature
     * Render geometries on the temporary layer.
     */
    drawFeature: function() {
        this.layer.drawFeature(this.polygon, this.style);
        this.layer.drawFeature(this.point, this.style);
    },
    
    /**
     * Method: getSketch
     * Return the sketch feature.
     *
     * Returns:
     * {<OpenLayers.Feature.Vector>}
     */
    getSketch: function() {
        return this.polygon;
    },

    /**
     * Method: getGeometry
     * Return the sketch geometry.  If <multi> is true, this will return
     *     a multi-part geometry.
     *
     * Returns:
     * {<OpenLayers.Geometry.Polygon>}
     */
    getGeometry: function() {
        var geometry = this.polygon && this.polygon.geometry;
        if(geometry && this.multi) {
            geometry = new OpenLayers.Geometry.MultiPolygon([geometry]);
        }
        return geometry;
    },

    /**
     * Method: dblclick
     * Handle double-clicks.  Finish the geometry and send it back
     * to the control.
     * 
     * Parameters:
     * evt - {Event} 
     */
    dblclick: function(evt) {
        if(!this.freehandMode(evt)) {
            // remove the penultimate point
            var index = this.line.geometry.components.length - 2;
            this.line.geometry.removeComponent(this.line.geometry.components[index]);
            this.removePoint();
            this.finalize();
        }
        return false;
    },
    
    activate: function() {
        if(!OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            return false;
        }
        // create temporary vector layer for rendering geometry sketch
        // TBD: this could be moved to initialize/destroy - setting visibility here
        var options = OpenLayers.Util.extend({
            displayInLayerSwitcher: false,
            // indicate that the temp vector layer will never be out of range
            // without this, resolution properties must be specified at the
            // map-level for this temporary layer to init its resolutions
            // correctly
            calculateInRange: OpenLayers.Function.True
        }, this.layerOptions);
//        this.layer = new OpenLayers.Layer.Vector(this.CLASS_NAME, options);
//        this.map.addLayer(this.layer);
        return true;
    },
    
    mousedown: function(evt) {
        // ignore double-clicks
        if (this.lastDown && this.lastDown.equals(evt.xy)) {
            return false;
        }
        if(this.lastDown == null) {
            this.firstEvent = evt;
        }
        return OpenLayers.Handler.Path.prototype.mousedown.apply(this, arguments);
    },
        
    CLASS_NAME: "OpenLayers.Handler.Polygon"
});
