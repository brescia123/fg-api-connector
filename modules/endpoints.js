module.exports = (function (app, kimono, firebase, config) {
	app.get('/', function(req, res) {
		res.send(config);
	});
	app.post('/update', function(req, res) {
		console.log('Update started...');
		var k_players;

		//Get from Kimono
		kimono.get_k_players(function (err, players) {
			if(err) {
				console.log('Kimono error: ' + err);
				res.status(500).end();
			}else{
				k_players = players;
				res.status(200).end();
				firebase.set('players', k_players);

			}
		});

		//Put to Firebase
		// console.log('Updating Firebase...');

		// firebase.set('players', k_players);

		// console.log('Firebase updated...');

	});
});