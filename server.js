var express = require('express');
var FirebaseClient = require('firebase-client');
var request = require("request");
var config = require("config");

// Config
var urls = config.get('urls');
var apikey = config.get('apikey');

// Create Expressjs app
var app = express();

// Setup Firebase
var firebase = new FirebaseClient({
	url: "https://votes-test1.firebaseio.com/api"
});

// Setting port
app.set('port', (process.env.PORT || 5000));

/*
ENDPOINTS
*/

// Default
app.get('/', function(req, res) {
	firebase.get()
		.then(function(body) {
			res.send(body);
		});
});

// Endpoint to update Firebase from Kimono APIs
app.post('/update', function(req, res) {
	console.log("Update started...")

	var error = false;
	var k_goal_keepers, k_defenders, k_midfielders, k_strickers;

	/*
	Make request to all four APIs (goal_keepers, defenders, midfielders, strickers) to 
	to activate Kimono crawler
	*/
	request(urls.kimono_base + urls.goal_keepers + "?apikey=" + apikey, 
	function(err, response, body) {
		if(err) console.log("Error retrieving goal_keepers from Kimono");
		k_goal_keepers = JSON.parse(body);;
		console.log("goal_keepers on Kimono updated");
		if (!error) {
			firebase
				.set('goal_keepers', k_goal_keepers)
				.then(function(body) {
					console.log("Firebase updated!")
					res.status(200).end();				
				})
				.fail(function(err) {
					console.log("Firebase error")
					res.status(500).end();									
				});
	}
		res.status(200).end();
	});
	// request("https://www.kimonolabs.com/api/e1be6rac?apikey=WQpWv313F2Pf5BmndKN6w2J3h4jiVCa7", 
	// function(err, response, body) {
	//   console.log("goal_keepers on Kimono updated");
	// });
	// request("https://www.kimonolabs.com/api/e1be6rac?apikey=WQpWv313F2Pf5BmndKN6w2J3h4jiVCa7", 
	// function(err, response, body) {
	//   console.log("goal_keepers on Kimono updated");
	// });
	// request("https://www.kimonolabs.com/api/e1be6rac?apikey=WQpWv313F2Pf5BmndKN6w2J3h4jiVCa7", 
	// function(err, response, body) {
	//   console.log("goal_keepers on Kimono updated");
	// });

	// request("https://www.kimonolabs.com/api/a1hzzn7c?apikey=WQpWv313F2Pf5BmndKN6w2J3h4jiVCa7",
	// function(err, response, body) {
	// 	if (err) console.log("Kimono error");
	// 	data = prepare_data(body);
	// 	console.log("Kimono crawl ended.\nUpdating Firebase...");
	// 	firebase.update('api', data)
	// 				.then(function(body) {
	// 					console.log("Firebase updated!")
	// 					res.status(200).end();				
	// 				})
	// 				.fail(function(err) {
	// 					console.log("Firebase error")
	// 					res.status(500).end();									
	// 				});
	// });

	// TODO: Unify all the apis
});


// Starting server
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