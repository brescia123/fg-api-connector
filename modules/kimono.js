var Kimono = (function (request, config) {
	var urls = config.get('urls');
	var apikey = config.get('apikey');

	this.get_k_players = function (callback) {
		console.log("get_k_players");
		request(urls.kimono_base + urls.g_players + "?apikey=" + apikey, 
			function (err, response, body) {
				players = JSON.parse(body);
				callback(err, players);
			}	
		);
	}

});

module.exports = Kimono;