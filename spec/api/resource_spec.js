var odvis_development_url = "http://odvis.at:8008";

var frisby = require('frisby');

frisby.create('get a list of all resources')
.get(odvis_development_url + '/resource')
.expectStatus(400)
.expectHeaderContains('content-type', 'application/json')
.expectJSON({
  code: "invalid_request",
  error: true
})
.toss();

frisby.create('avoid sql injection attempts')
.get(odvis_development_url + '/resource/this"is`not;funny.json')
.expectStatus(404)
.toss();

frisby.create('access a nonexisting resource')
.get(odvis_development_url + '/resource/not.json')
.expectStatus(404)
.expectHeaderContains('content-type', 'application/json')
.expectJSON({
  "code": "dataset.missing",
  "error": true,
  "message": "Not found",
  "data": {
    "id": "not"
  }
})
.toss();

var dataset = {
  uuid: 'ooe-8EFFF49E00E847C985B9C63E42851494',
  table: 'ooe_bevoelkerung_seit_1869',
  fields: ["nuts2", "district_code", "name", "year", "pop_total"],
  types:  ["text",  "text",          "text", "text", "number"   ]
};

var json_type_expectation = {};
json_type_expectation[ dataset.fields[0] ] =  dataset.types[0];

frisby.create('access existing resource by uuid')
.get(odvis_development_url + '/resource/' + dataset.uuid + '.json')
.expectStatus(200)
.expectHeaderContains('content-type', 'application/json')
.expectJSONTypes([ json_type_expectation ])
.toss();

frisby.create('access existing resource by table name')
.get(odvis_development_url + '/resource/' + dataset.table + '.json')
.expectStatus(200)
.expectHeaderContains('content-type', 'application/json')
.expectJSONTypes([ json_type_expectation ])
.toss();

frisby.create('filter existing resource by one columens value')
.get(odvis_development_url + '/resource/' + dataset.table + '.json?district_code=40101')
.expectStatus(200)
.expectHeaderContains('content-type', 'application/json')
.expectJSONTypes([ json_type_expectation ])
.expectJSONLength( 50 )
.toss();
