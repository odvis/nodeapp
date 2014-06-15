var _ = require('underscore');

/* ================== configuration: loaded from config.yml ===================== */
if( process.env.NODE_ENV != 'development' &&  process.env.NODE_ENV != 'production') {
  console.log("please set NODE_ENV to either development or production, not " +  process.env.NODE_ENV);
  process.exit(1);
}
var odvis = require('config');
odvis.node_env =  process.env.NODE_ENV;
odvis.pgConnString = _.template("pg://<%= user %>:<%= password %>@<%= host %>:<%= port %>/odvis", odvis.datasource);


/* =================== load packages ============================================ */
var express = require('express');
var routescan = require('express-routescan');
var http = require('http');
var path = require('path');
var Windshaft = require('windshaft');
var ColorArray = require('./lib/colorarray');
var pg = require("pg");
pg.defaults.poolSize = 5;

console.log("=== starting odvis in environment " + odvis.node_env + ", on port " + odvis.port + " and windshaft on port " + odvis.wsport + " ===");
console.log("=== pg is " + odvis.pgConnString + " ===");

/* =================== set up the odvis express app =============================== */
var app = express();
app.use(function(req, res, next){
  res.locals.odvis = odvis;
  next();
})
app.set('port', odvis.port);
/* Static Files */
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.static(path.join(__dirname, 'public')));
/* View */
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
/* Logging and Debugging */
app.use(express.logger( odvis.node_env == 'development' ? 'dev' : 'default'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.configure('development', function(){
  app.use(express.errorHandler());
});
/* Other Routes */
routescan(app);


/* =================== set up the windshaft app =============================== */
var config = {
  base_url : '/database/:dbname/table/:table/columns/:columns',
  base_url_notable : '/database/:dbname',
  grainstore : {
    datasource : odvis.datasource,
    cachedir: odvis.cachedir
  }, //see grainstore npm for other options
  redis : odvis.windshaft_redis,
  enable_cors : true,
  req2params : function(req, callback) {
    // console.log("windshaft callback: req2params started");
    
    var columnArray  = req.params.columns.split("+");
    var columnString = req.params.columns.replace(/\+/g, ', ');

    // TODO: get interactivity via UtfGrid to run
    // req.params.interactivity = { 'layer':0, 'fields': [ columnArray[0] ] };
    // req.params.interactivity = [ columnArray[0] ]; 
    // req.params.interactivity_fields = columnArray[0];
    req.params.interactivity = columnArray[0];

    // ================ read geography and the selected data column from database ==================
    req.params.sql = 
            "(SELECT gkz, name, the_geom_webmercator from gemeinden) geography "
          + "  INNER JOIN (select district_code, " + columnString + " from " + req.params.table + ") data "
          + "  ON (geography.gkz = data.district_code) ";

    var pg = require("pg");
    var client = new pg.Client(odvis.pgConnString );
    client.connect();

    // ===== we want separate the date into sextiles, display it using 6 different colors. we'll need 5 values to separate the data ============
    var no_steps = 5;
    var sql = _.template(
      'SELECT MIN(<%= col %>) AS  value, tile FROM '
      + ' (SELECT <%= col %>, ntile(<%= no %>) over (order by <%= col %>) as tile FROM <%= tab %>) data '
      + ' GROUP BY tile ORDER BY tile',
      { 
        tab: req.params.table, 
        col: '"' + columnString + '"',
        no: no_steps + 1
      }
    );

    client.query(sql, function(err, result) {
      var colors = ColorArray.create_colors(no_steps, columnString);
      var steps = _.pluck( result.rows, 'value' );
      steps.shift(); // the first value of the first quintile is just min, we don't need it
      client.end();

      req.params.style = _.template(
          "#<%= table %>[<%= column %>>=" + steps[4] + "]{polygon-fill:" + colors[5] + "; line-color:#FFF; line-width:0.3; } \n" + 
          "#<%= table %>[<%= column %><" + steps[4] + "]{polygon-fill:" + colors[4] + "; line-color:#FFF; line-width:0.3; } \n" + 
          "#<%= table %>[<%= column %><" + steps[3] + "]{polygon-fill:" + colors[3] + "; line-color:#FFF; line-width:0.3; } \n" + 
          "#<%= table %>[<%= column %><" + steps[2] + "]{polygon-fill:" + colors[2] + "; line-color:#FFF; line-width:0.3; } \n" + 
          "#<%= table %>[<%= column %><" + steps[1] + "]{polygon-fill:" + colors[1] + "; line-color:#FFF; line-width:0.3; } \n" + 
          "#<%= table %>[<%= column %><" + steps[0] + "]{polygon-fill:" + colors[0] + "; line-color:#FFF; line-width:0.3; } \n",
          { table : req.params.table, column : columnString });
      
      if(odvis.node_env=="development"){
        console.log("windshaft callback: req2params finished");
        // console.dir(req.params);
      }
      // send the finished req object on
      callback(null, req);
    });
  }
};


// =====================  Preparations are finished =====================
//
// Start the windshaft server
//

var ws = new Windshaft.Server(config);
ws.on('error', function(err){
  console.log('there was an error starting windshaft:', err.message);
  process.exit(1);
});
console.log('starting ' + odvis.node_env + ' windshaft: map tiles are now being served out of: http://odvis.at:' + odvis.wsport + '' + config.base_url + '/:z/:x/:y');
ws.listen(odvis.wsport);

//
// Start the odvis server
//

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
