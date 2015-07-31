
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// the ExpressJS App
var app = express();

// configuration of expressjs settings for the web server.

// server port number
app.set('port', process.env.PORT || 5000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());

/**
 * CORS support for AJAX requests
 */

app.all('*', function(req, res, next){
  if (!req.get('Origin')) return next();
  // use "*" here to accept any origin
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'PUT');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  // res.set('Access-Control-Allow-Max-Age', 3600);
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});

// api baseURI is at /api/

// API Routes
// ROUTES, logic is in routes/index.js

var routes = require('./routes/index.js');

// home route is not really an API route, but does respond back
app.get('/', routes.index); // calls index function in /routes/index.js

/* ------------------------------------- */
/* ---------- API Routes --------------- */

// Utility
app.get('/api/utils/clearData', routes.clearData);
app.get('/api/utils/grabAllData', routes.grabAllData);

// Informasi Pendukung
app.get('/api/haltebus', routes.get);
app.get('/api/kepolisian', routes.get);
app.get('/api/rumahsakit', routes.get);
app.get('/api/sekolah', routes.get);
app.get('/api/lokasitransportasi', routes.get);
app.get('/api/tempatibadah', routes.get);

// Pariwisata & Kebudayaan
app.get('/api/pariwisata/lokasikuliner', routes.get);
app.get('/api/pariwisata/lokasiWisata', routes.get);
app.get('/api/pariwisata/lokasiPatung', routes.get);
app.get('/api/pariwisata/lokasiBelanja', routes.get);
app.get('/api/pariwisata/lokasiMuseum', routes.get);

/* --------------------------------------- */


// if route not found, respond with 404
app.use(function(req, res, next){

	var jsonData = {
		status: 'ERROR',
		message: 'Sorry, we cannot find the requested URI'
	};
	// set status as 404 and respond with data
  res.status(404).send(jsonData);

});

// create NodeJS HTTP server using 'app'
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
