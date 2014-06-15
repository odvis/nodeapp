/**
 * Routes for retrieving a list of available datasets
 * @author Katrin Hewer <khewer.mmt-m2012@fh-salzburg.ac.at>
 */

module.exports = {
  '/RetrieveDatasets' : function(req, res) {
      console.log("route: RetrieveDatasets ");
      RetrieveDatasets(res);
  }
};

function RetrieveDatasets(res) {
  console.log("======================== RetrieveDatasets ===================");
  console.dir(res.locals.odvis.pgConnString);
  var pg = require("pg");

  return pg.connect(res.locals.odvis.pgConnString, function(err, client, done) {

    var sql = 'SELECT uuid, title, categorization, publisher, resource FROM metadata ORDER BY title';

    client.query(sql, function(err, result) {

      var dataJSON = {
        'data' : []
      };

      for ( i = 0; i < result.rows.length; i++) {
        dataJSON.data[i] = {
          "uuid" : result.rows[i].uuid,
          "title" : result.rows[i].title,
          "categorization" : result.rows[i].categorization,
          "publisher" : result.rows[i].publisher,
          "table" : result.rows[i].resource
        };
      }

      console.log("======================== /RetrieveDatasets ===================");
      return res.send(dataJSON);
    });
  });


}

