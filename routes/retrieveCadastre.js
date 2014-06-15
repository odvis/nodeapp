/**
 * Example Routes for retrieving geojson data from postgis database
 * @author Katrin Hewer <khewer.mmt-m2012@fh-salzburg.ac.at>
 */


module.exports = {

  'retrieveCadastre': function(req, res){ 
    RetrieveCadastre(req.body, res);
  }

};


/**
 * Read geojson data from the postgis database and send them to the client 
 */
function RetrieveCadastre(bounds, res) {
  
	var pg = require("pg");
	var connString = 'pg://postgis:odvis2013@localhost:5432/gemeinden';

	var client = new pg.Client(connString);
	client.connect();

	var sql = 'SELECT ST_AsGeoJSON(st_transform(way,4326)) as shape, name, iso FROM bundeslaender';

	client.query(sql, function(err, result) {

		var featureCollection = new FeatureCollection();

		for ( i = 0; i < result.rows.length; i++) {
			featureCollection.features[i] = {"type": "Feature", "properties":{"name": result.rows[i].name, "iso": result.rows[i].iso}, "geometry": JSON.parse(result.rows[i].shape)};
		}

		res.send(featureCollection);
	});

	/*
	pg.connect(connString, function(err, client) {
	var sql = 'select ST_AsGeoJSON(geog) as shape ';
	sql = sql + 'from spatial.state_1 ';
	sql = sql + 'where geog && ST_GeogFromText(\'SRID=4326;POLYGON((' + bounds._southWest.lng + ' ' + bounds._southWest.lat + ',' + bounds._northEast.lng + ' ' + bounds._southWest.lat + ',' + bounds._northEast.lng + ' ' + bounds._northEast.lat + ',' + bounds._southWest.lng + ' ' + bounds._northEast.lat + ',' + bounds._southWest.lng + ' ' + bounds._southWest.lat + '))\') ';
	sql = sql + 'and ST_Intersects(geog, ST_GeogFromText(\'SRID=4326;POLYGON((' + bounds._southWest.lng + ' ' + bounds._southWest.lat + ',' + bounds._northEast.lng + ' ' + bounds._southWest.lat + ',' + bounds._northEast.lng + ' ' + bounds._northEast.lat + ',' + bounds._southWest.lng + ' ' + bounds._northEast.lat + ',' + bounds._southWest.lng + ' ' + bounds._southWest.lat + '))\'));';
	*/

}

// GeoJSON Feature Collection
function FeatureCollection() {
	this.type = 'FeatureCollection';
	this.features = new Array();
}


