var Kimono = (function (request, config, utils) {
	var urls = config.get('urls');
	var apikey = process.env.F_APIKEY;

	this.get_players = function (callback) {
		console.log("kimono.get_players");
		makeRequest(urls.g_players, callback);
	}

	this.get_votes = function (callback) {
		console.log("kimono.get_votes");
		makeRequest(urls.g_votes, callback);
	}

	function makeRequest(url, callback) {
		request(urls.kimono_base + url + "?apikey=" + apikey,
			function (err, response, body) {
				callback(err, body);
			}
		);
	}
});

module.exports = Kimono;
