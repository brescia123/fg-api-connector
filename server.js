// Create Expressjs app
var express = require('express');
var app = express();

// Requires
var FirebaseClient = require('firebase-client');
var request = require('request');
var config = require('config');
var utils = require('./modules/utils.js');
var Kimono = require('./modules/kimono.js');
kimono = new Kimono(request, config, utils);

// Config
var urls = config.get('urls');

// Setup Firebase
var firebase = new FirebaseClient({
	url: config.get('urls').firebase_base
});

// Setup endpoints
require('./modules/endpoints.js')(app, kimono, firebase, config, utils);

// Setup port
app.set('port', (process.env.PORT || 5000));

// Start server
var server = app.listen(app.get('port'), 'localhost', function() {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Connector listening at http://%s:%s', host, port);

});
