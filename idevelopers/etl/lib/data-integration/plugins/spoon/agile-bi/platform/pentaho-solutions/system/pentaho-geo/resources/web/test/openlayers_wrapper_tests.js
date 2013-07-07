/**
 * The Pentaho proprietary code is licensed under the terms and conditions
 * of the software license agreement entered into between the entity licensing
 * such code and Pentaho Corporation. 
 */


doh.register("OpenLayers Wrapper Tests", [

    {  name: "1. Test Packages and Classes",
        runTest: function(){
        
            doh.assertTrue( pentaho.visualizations );    
            doh.assertTrue( pentaho.openlayers );    
            doh.assertTrue( pentaho.openlayers.OpenLayersMap );    
            
        }
    },

    {  name: "2. Test Visualizations",
        runTest: function(){
        
            doh.assertTrue( pentaho.visualizations.length > 0 );    
        }
    },
    
    {  name: "3. Test Init",
        runTest: function(){

            // add a div to the page for the visualization to use
            var div = document.createElement('DIV');
            div.setAttribute('id','mapElement');
            div.setAttribute('style','width:300px; height:300px');        
            document.body.appendChild(div);
        
            var ol = new pentaho.openlayers.OpenLayersMap( div );
            doh.assertTrue( ol != null );    
            
            ol.init();
            
        }
    }
            
    ]
);
