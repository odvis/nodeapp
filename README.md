# ODVIS

Odvis is a node.js visualisation tool for demographic open government data of Austria on a map.
Use it on http://odivs.at/

This REAMDE describes installing the software (a node-app) on your own server.

## App

The App is build in Node with the help of the web development framework 
[express](https://npmjs.org/package/express) and the template 
engine [jade](https://npmjs.org/package/jade). 

It uses postgres/postgis as its database. Maps ar rendered as tiles by Mapnik and are displayed by the JavaScript 
library leaflet. 

An example how to build a Node App with express, jade, 
postgis and leaflet can be found [here](http://boomphisto.blogspot.de/2011/07/nodejs-express-leaflet-postgis-awesome.html). 
Note that the example uses an older version of express with a slightly different syntax.


## Dependencies
* node.js v0.8
* express v3.3.7
* jade
* underscore
* semver
* pg v2.5.0
* [windshaft](https://github.com/CartoDB/Windshaft) v0.13.2


## Installation

* Install Node 0.8: https://gist.github.com/isaacs/579814 mit Node 0.8 source: http://nodejs.org/dist/v0.8.22/node-v0.8.22.tar.gz
* Pull from Git https://github.com/odivs/nodeapp.git (actual Branches: master)
* Change git config: git config --global url."https://".insteadOf git://
* install packages: npm install (DO NOT USE SUDO!!!)

### Windshaft configuration
* add configuration files to node_modules/windshaft/config
* actual config files can be found in the dropbox folder "windshaft"

### Possible Windshaft Installation Errors

* windshaft ENOENT and ENOTEMPTY error:
	npm rm windshaft
	npm cache clear
	npm install windshaft

### windshaft eio error:
	cd node_modules/windshaft/node_modules/tilelive-mapnik/node_modules/eio
	node-waf configure
	make


## Run App

### Development

set up your configuration:

    cp config/sample.yml config/default.yml
    vi config/development.yml

Run the app by "node app.js". After that you can watch the project on http://localhost:8008/
or on whatever port you specified in the config.

### Production

### Start the app as a daemon with forever

Install forever:

    [sudo] npm install forever -g

Run App:

    forever start app.js

Stop App:

    forever stop 0

More usage options can be found [here](https://npmjs.org/package/forever)



## Database

In the database each available Datasets is saved as a table. 
Moreover there is a table "metadata" which contains a list of all this datasets with additional information.  Columns:

* uuid
* title
* license_title
* maintainer
* download_url
* tags
* notes
* publisher
* categorization
* maintainer_link
* metadata_modified
* resource

This informations can be read from the 
[CKAN api](http://ckan.readthedocs.org/en/ckan-1.7.1/api-v2.html) 
from www.data.gv.at ([http://www.data.gv.at/katalog/api](http://www.data.gv.at/katalog/api). 
Only the resource, which is the name of the related dataset tabele must be added manually.

### Pyton Skript for reading the data:

	import psycopg2
	
	import sys
		
	import pprint
		
	import httplib
		
	import simplejson as json

	def main():

	  #make database connection
	  conn_string = "host='localhost' dbname='...' user='...' password='...'"

	  conn = psycopg2.connect(conn_string)
	  cursor = conn.cursor()

	  #get uuid
	  ...

	  # read data from ckan by http request
	  httpconn = httplib.HTTPConnection('www.data.gv.at')
		
	  httpconn.request("GET", '/katalog/api/rest/dataset/%s'%(uuid))
		
	  ckan = httpconn.getresponse()
	  ckanStr = ckan.read()		
		
	  ckanJSON = json.loads(ckanStr)	

	  license_title = ckanJSON['license_title']
	  ...

	  #insert data into database
	  cursor.execute("INSERT INTO metadata( uuid, title, license_title, maintainer, download_url, tags, notes, publisher, categorization, maintainer_link, metadata_modified ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",( uuid, title, license_title, maintainer, download_url, tags, notes, publisher, categorization, maintainer_link, metadata_modified ))


	  #commit and close db connection
	  conn.commit()
	
	  cursor.close()
	
	  conn.close()


### Data to read from ckan:
license_title
maintainer
download_url
tags
notes
title
extras.publisher
extras.categorization
extras.maintainer_link
extras.metadata_modified