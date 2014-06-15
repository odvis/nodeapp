/**
 * Routes for retrieving data from one table / resource
 * @author Katrin Hewer <khewer.mmt-m2012@fh-salzburg.ac.at>
 */

module.exports = {
  '/RetrieveData' : function(req, res) {
      RetrieveData(req, res);
  }
};


/**
 * retrieves requested information for a dataset from the pg database and send them back to the client
 * @param {Object} data - contains the database table (resource) in which the information can be found
 * @param {Object} res
 */
function RetrieveData(req, res) {
  console.log("======================== RetrieveData ===================");
  console.dir(res.locals.odvis.pgConnString);
  console.log("RetrieveData");
  console.dir(req.query);
  var table = req.query.table;
  var pg = require("pg");

  pg.connect(res.locals.odvis.pgConnString, function(err, client, done) { 
    if(err) {
      return res.send({error: "no connection to database"});
    }
    var sql = "select column_name from information_schema.columns where table_schema='public' and table_name='" + table + "'";
    console.log(sql);

    client.query(sql, function(err, result) {

      var dataJSON = {
        'data' : []
      };

      for ( i = 0; i < result.rows.length; i++) {
        var name = result.rows[i].column_name
        if (name != 'name' && name != 'ref_date' && name != 'year' && name != 'nuts2' && name != 'nuts3' && name != 'district_code') {
          dataJSON.data[dataJSON.data.length] = {
            'title' : result.rows[i].column_name
          };
        }
      }

      console.dir(dataJSON);
      console.log("======================== /RetrieveData ===================");
      done();
      res.send(dataJSON);
    });
  });
}
