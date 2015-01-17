var express = require('express');
var FirebaseClient = require('firebase-client');
var request = require("request");

var app = express();
var firebase = new FirebaseClient({
	url: "https://votes-test1.firebaseio.com/"
});

app.set('port', (process.env.PORT || 5000));


app.get('/', function(req, res) {
	firebase.get()
		.then(function(body) {
			res.send(body);
		});
});

// Endpoint to update Firebase from Kimono APIs
app.post('/update', function(req, res) {
	request("https://www.kimonolabs.com/api/a1hzzn7c?apikey=WQpWv313F2Pf5BmndKN6w2J3h4jiVCa7",
		function(err, response, body) {
			data = prepare_data(body);
			firebase.update('api', data)
						.then(function(body) {
							res.status(200).end();				
						})
						.fail(function(err) {
							res.status(500).end();									
						});
		});
});

var server = app.listen(app.get('port'), function() {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Connector listening at http://%s:%s', host, port);

});

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
		};
		// Replace "api" key with "role"
		data_array[i]['role'] = role;
		delete data_array[i]['api'];

		//Replace team values
		var team = data_array[i].team;
		team = team.toLowerCase();
		data_array[i].team = team.substring(0, team.length - 1);
	};

	data = {
		'players' : data_array
	};

	return data;
}