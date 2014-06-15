function Map(map_config) {
  var map;
  var cadastralLayer;

  map = new L.Map('mapContainer', {
    zoomControl : false
  });

  console.log(map.options.crs);

  // Tile Layer
  var baseUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var baseCopyright = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
  var baseLayer = new L.TileLayer(baseUrl, {
    maxZoom : 20,
    attribution : baseCopyright,
    crs : L.CRS.EPSG900913
  });

  var startPosition = new L.LatLng(47.7, 13);
  
  var dataLayer = new L.TileLayer();

  map.setView(startPosition, 7).addLayer(baseLayer);

  var utfGrid = new L.UtfGrid('http://{s}.tiles.mapbox.com/v3/mapbox.geography-class/{z}/{x}/{y}.grid.json?callback={cb}', {
    resolution: 2
  });

  utfGrid.on('mouseover', function (e) {
    console.log('mouseover: ');
    console.dir(e);
    if (e.data && e.data.admin) {
      $('#console').html( 'hover: ' + e.data.admin );
    } 
  });
  map.addLayer(utfGrid);


  this.dataUrl = function(table, columnString){
    return 'http://odvis.at:' + map_config.wsport + '/database/odvis/table/' + table + '/columns/' + columnString + '/{z}/{x}/{y}';
  }

  /*
   * This is what data looks like for the next two functions:
   *
   *    { 
   *      "type":1,
   *      "columns":["pop_total","pop_women","pop_men"],
   *      "checked":[true,true,true],
   *      "metadata":{
   *        "uuid":"e374c340-1cfd-11e2-892e-0800200c9a66",
   *        "title":"Bevölkerung nach Geschlecht",
   *        "categorization":["bevoelkerung"],
   *        "publisher":"Land Steiermark",
   *        "table":"stmk_01012012_sex"}
   *    }
   */

  this.mapCode = function(data) {
    var dataUrl = this.dataUrl(data.metadata.table, data.columns[0]);
    return _.template('<!-- Embed code from ODVIS.at -->                                                       '+"\n"
      +'<link href="http://cdn.leafletjs.com/leaflet-0.6.4/leaflet.css" rel="stylesheet">                      '+"\n"
      +'                                                                                                       '+"\n"
      +'<script type="text/javascript" src="http://cdn.leafletjs.com/leaflet-0.6.4/leaflet.js"></script>       '+"\n"
      +'<div id="my_map" style="width:100%;height:100%;"></div>                                                '+"\n"
      +'<script>                                                                                               '+"\n"
      +'  var map = new L.Map("my_map", {                                                                      '+"\n"
      +'    zoomControl : true                                                                                 '+"\n"
      +'  });                                                                                                  '+"\n"
      +'  var baseLayer = new L.TileLayer(                                                                     '+"\n"
      +'    "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",                                               '+"\n"
      +'    {                                                                                                  '+"\n"
      +'      maxZoom : 20,                                                                                    '+"\n"
      +'      attribution : "Map data © <a href=http://openstreetmap.org>OpenStreetMap</a> contributors",    '+"\n"
      +'      crs : L.CRS.EPSG900913                                                                           '+"\n"
      +'    }                                                                                                  '+"\n"
      +'  );                                                                                                   '+"\n"
      +'  var odvisLayer = new L.TileLayer(                                                                    '+"\n"
      +'    "<%= dataUrl %>",                                                                                  '+"\n"
      +'    {                                                                                                  '+"\n"
      +'      maxZoom : 20,                                                                                    '+"\n"
      +'      attribution : "<%= publisher %> | ODVIS.at",                                                     '+"\n"
      +'      opacity : 0.75                                                                                   '+"\n"
      +'    }                                                                                                  '+"\n"
      +'  );                                                                                                   '+"\n"
      +'  map.setView( new L.LatLng(47.7, 13), 7).addLayer(baseLayer).addLayer(odvisLayer);                    '+"\n"
      +'</script>                                                                                              '+"\n", 
      {'dataUrl': dataUrl + '.png', 'publisher': data.metadata.publisher}
   );
  }

  this.displayDatamap = function(data) {
    console.log("this.displayDatamap");
    console.dir(data);
    var metadata = data.metadata;
    var table = metadata.table;
    var publisher = metadata.publisher;
    var columns = data.columns;
    var checked = data.checked;
    
    var columnString = "";
    for(i=0; i<columns.length; i++){
      if(checked[i]){
          columnString = columns[i];  
          console.log("found a checked column!" + columnString);
      }
    }
    if( columnString == "" ) {
      columnString = columns[0];
      console.log("did not find a checked column, using default " + columnString);
    }
    // this.map.displayDatamap(metadata.table, columnString, metadata.publisher);    
    
    console.log("map on port " + map_config.wsport);

    map.removeLayer(dataLayer);    
    map.removeLayer(utfGrid);    

    var dataUrl = this.dataUrl(table, columnString);

    $('#console').text("map server " + dataUrl);

    dataLayer = new L.TileLayer(dataUrl+'.png', {
      maxZoom : 20,
      attribution : publisher+' | ODVIS.at',
      opacity : 0.9
    });
    dataLayer.on('loading', function(event){
      console.log("loading " + event.target._url);
      map.spin(true);
    });
    dataLayer.on('load', function(event){
      console.log("done loading " + event.target._url);
      $('#console').text("Daten Visualisieren");
      map.spin(false);
    });

    map.setView(startPosition, 7).addLayer(dataLayer);

    utfGrid = new L.UtfGrid(dataUrl+'.grid.json', {
      resolution: 2
    });

    utfGrid.on('mouseover', function (e) {
      console.log('mouseover: ');
      console.dir(e);
      if (e.data && e.data.admin) {
        $('#console').html( 'hover: ' + e.data.admin );
      } 
    });
    // utfGrid machen wir nicht, weils nicht funktioniert:
    // http://odvis.at:8002/database/odvis/table/ooe_bevoelkerung_seit_1869/columns/pop_total/8/137/88.grid.json
    //  error: "Missing interactivity parameter"
    // http://odvis.at:8002/database/odvis/table/ooe_bevoelkerung_seit_1869/columns/pop_total/8/137/88.grid.json?interactivity=pop_total
    //  error: "Tileset has no interactivity"
    // map.setView(startPosition, 7).addLayer(utfGrid);
  }
  /*
      map.on('load', function(e) {
      console.log("map loaded");
      requestUpdatedCadastre(e.target.getBounds());
      });
      */

  /*
      map.on('moveend', function(e) {
      requestUpdatedCadastre(e.target.getBounds());
      });
      */
  /*
      function requestUpdatedCadastre(bounds) {
      console.log("query");
      $.ajax({
type : 'POST',
url : '/RetrieveCadastre',
dataType : 'json',
data : JSON.stringify(bounds),
contentType : 'application/json; charset=utf-8',
success : function(result) {
console.log("parse");
parseResponseCadastre(result);
},
error : function(req, status, error) {
alert('Unable to get cadastral data!');
}
});

}

var cadastralLayer;

function parseResponseCadastre(data) {

if (cadastralLayer != undefined) {
console.log("!= undefined");
map.removeLayer(cadastralLayer);
}

function style() {
return {
fillColor : '#cccccc',
weight : 1,
opacity : 1,
color : 'white',
dashArray : '3',
fillOpacity : 0.7
};
}

console.log(data);

cadastralLayer = L.geoJson(data, {
style : style
}).addTo(map);

console.log("layer added");
}
*/
}
