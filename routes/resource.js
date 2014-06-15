/**
 * SODA2 API - retrieving resources
 * @author Brigitte Jellinek <brigitte.jellinek@fh-salzburg.ac.at>
 * 
 * see http://dev.socrata.com/docs/endpoints
 */

module.exports = {
  '/resource' : {
    regexp: /^\/resource(?:\/([\w-]*)\.json)?$/,
    fn: function(req, res) {
      resource(req, res);
    }
  }
};


/**
 * retrieves requested information for a dataset from the pg database and send them back to the client
 * @param {Object} data - contains the database table (resource) in which the information can be found
 * @param {Object} res
 */
function resource(req, res) {


  console.log("======================== /resource ===================");
  console.dir(res.locals.odvis.pgConnString);
  console.dir(req.params[0]);
  console.dir(req.query);

  res.setHeader('content-type', 'application/json');

  if( ! req.params[0] ) {

    res.status(400).send({
      "code": "invalid_request",
      "error": true,
      "message": "Parameter 'resourceId' is required as next part of the path. e.g. resource/ooe-8EFFF49E00E847C985B9C63E42851494.json"
    });

  }

  var pg = require("pg");
  var _ = require('underscore');

  pg.connect(res.locals.odvis.pgConnString, function(err, client, done) { 
    if(err) {
      return res.status(500).send({error: true, message: "no connection to database"});
    }
    var resourceId = req.params[0];

    var sql = 'SELECT uuid, title, categorization, publisher, resource FROM metadata WHERE ( uuid=$1 OR resource=$2 )';
    var sql_args = [ resourceId, resourceId ];
    console.log(sql);
    console.dir(sql_args);

    return client.query(sql, sql_args, function(err,result) {
      if(err || result.rowCount == 0) {
        done();
        return res.status(404).send({code: "dataset.missing", error: true, message: "Not found", data: { id: resourceId } });
      }
    

      var table = result.rows[0].resource;
      var sql = 'SELECT * FROM ' + table;
      var where = [];
     
      for( var column_name in req.query ) {
        var value = req.query[column_name];
        if( column_name.match(/^\w+$/) && value.match(/^\w+$/) ) {
          where.push('"' + column_name + '"=' + "'" + value + "'");
        } else {
          return res.status(500).send({error: true, message: "filter not valid"});
        }
      }
      if ( where.length > 0 ) {
        sql += " WHERE " + where.join(" AND ");
      }
      console.log(sql);
        
      return client.query(sql, function(err,result) {
        if(err) {
          done();
          return res.status(404).send({code: "dataset.missing", error: true, message: "Not found", data: { id: resourceId } });
        }

        console.log("found " + result.rowCount + " rows with " + result.fields.length + " fields");
        console.dir(_.pluck(result.fields, 'name'));
        console.dir(_.pluck(result.fields, 'format'));
        console.log("======================== RetrieveData ===================");
        res.setHeader('X-SODA2-Fields', JSON.stringify( _.pluck(result.fields, 'name')   ));
        res.setHeader('X-SODA2-Types',  JSON.stringify( _.pluck(result.fields, 'format') ));
        done();
        res.status(200);
        return res.send(result.rows);
      });
    });
  });
}
