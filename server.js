// Create Expressjs app
var express = require('express');
var app = express();

// Requires
var FirebaseClient = require('firebase-client');
var request = require('request');
var config = require('config');
var Kimono = require('./modules/kimono.js');
kimono = new Kimono(request, config);

// Config
var urls = config.get('urls');

// Setup Firebase
var firebase = new FirebaseClient({
	url: 'https://fanta-genius.firebaseio.com/api'
});

// Setup endpoints
require('./modules/endpoints.js')(app, kimono, firebase, config);

// Setup port
app.set('port', (process.env.PORT || 5000));

// Start server
var server = app.listen(app.get('port'), function() {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Connector listening at http://%s:%s', host, port);

});


/*
Helper Methods
*/

// Do the adjustments to the date and prepare them to store in Firebase
var prepare_data = function (body) {
	var body_json = JSON.parse(body);
	data_array = body_json.results.collection1;

	for (var i = 0; i < data_array.length; i++) {

		// Replace role values
		var role = data_array[i].api;
		switch (role) {
			case 'goal_keepers':
				role = 'G';
				break;
			case 'defenders':
				role = 'D';
				break;
			case 'midfielders':
				role = 'M';
				break;
			case 'strickers':
				role = 'S';
				break;
		}
		// Replace "api" key with "role"
		data_array[i].role = role;
		delete data_array[i].api;

		//Replace team values
		var team = data_array[i].team;
		team = team.toLowerCase();
		data_array[i].team = team.substring(0, team.length - 1);
	}

	data = {
		'players' : data_array
	};

	return data;
};
