pen.define(["common-ui/vizapi/VizController", "geo/openlayers_wrapper"], function(){

  analyzerPlugins = typeof analyzerPlugins == "undefined" ? [] : analyzerPlugins;

  analyzerPlugins.push(
      {
        init:function () {
          dojo.require("pentaho.common.Messages");
          pentaho.common.Messages.addUrlBundle('pgeo',pentaho.openlayers.OpenLayersMap.buildUrl('i18n?plugin=pentaho-geo&name=resources/messages/messages'));

          // Register types to display in Analyzer
          if(!cv.pentahoVisualizations){
            cv.pentahoVisualizations = [];
          }
          cv.pentahoVisualizations.push(pentaho.visualizations.getById("open_layers"));

          cv.pentahoVisualizationHelpers["open_layers"] = {
            previousAction: null,
            canRefreshReport:function(report) {
              if (report.findGemsByGembarId("rows").length == 0)
                return false;
              if (report.findGemsByGembarId("color").length > 0 || report.findGemsByGembarId("size").length > 0)
                return true;
              return false;
            },
            generateOptionsFromAnalyzerState:function (report) {
              var userDefinedOpts = {};

              // set the last action taken
              if(report.visualization.args.configAction !== 'undefined' && report.visualization.args.configAction != null) {
                userDefinedOpts.action = "keepPanZoomState";
                report.visualization.args.configAction = null;
              } else if(report.history.current() != null) {
                var action = report.history.current().action;
                var inParamLinkMode = false;

                var filters = cv.getActiveReport().reportDoc.reportRecord.getElementsByTagName("predicate");
                dojo.forEach(filters, function(filter){
                  var paramname = filter.getAttribute("parameterName");
                  if(paramname){
                    if(window.location.href.indexOf("&"+paramname+"=") > 0){
                      inParamLinkMode = true;
                      return false;
                    }
                  }
                });

                if( inParamLinkMode ||                                  // filtered Param, extents change
                    action == "actionKeepSelectedItems" ||              // keep only
                    action == "actionRemoveSelectionFilters" ||         // removing selection filter
                    action == "actionChartType" ||                      // initial action to display the chart
                    action == "actionDrillIntoChart" ||                 // drill
                    ( action == "actionChartProps" && this.previousAction == "actionDrillIntoChart") ||
                    ( action == "actionOpenReport" &&                   // open a saved report
                        report.visualization.args.zoomState == null ) ) {
                  userDefinedOpts.action = "resetPanZoomState";
                } else if (action == "actionOpenReport" && report.visualization.args.zoomState != null) {
                  // set this to avoid autozooming if we are opening a report with saved zoomstate
                  userDefinedOpts.action = "keepPanZoomState";
                }
                this.previousAction = action;
              }
              return userDefinedOpts;
            }

          };

          dojo.declare("analyzer.OpenLayersConfig", [analyzer.ColorConfiguration], {
            onModelEvent:function (config, item, eventName, args) {
              if (eventName == "value") {
                // works by convention where the ids of the data req items match the property names
                this.report.visualization.args[item.id] = args.newVal;
                if(typeof(args.prevVal) != "undefined" && args.prevVal != args.newVal){
                  this.report.visualization.args.configAction = item.id + "Changed";
                }
              }
              this.inherited(arguments); // Let super class handle the insertAt and removedGem events
            },
            _setScalingType:function (scalingType) {

              this.report.visualization.args.scalingType = scalingType;
            },
            _setColorRange:function (range) {
              this.report.visualization.args.colorRange = range;
            },
            getConfiguration:function () {
              var config = this.inherited(arguments);
              return config;
            },
            updateConfiguration: function(config){
              var geo = config.byId("rows");
              var color = config.byId("color");
              var size = config.byId("size");
              var hasDisplayable = color.gems.length > 0 || size.gems.length > 0;
              color.required = !hasDisplayable;
              size.required = !hasDisplayable;

              dojo.forEach(this.report.visualization.dataReqs[0].reqs, function(item, i) {
                if(item.id == 'color' || item.id == 'size') {
                  item.required = !hasDisplayable;
                }
              });
            }

          });
          analyzer.LayoutPanel.configurationManagers["JSON_open_layers"] = analyzer.OpenLayersConfig;

        }
      }
  );
});