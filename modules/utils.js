module.exports = exports = {};

exports.const = {
  firebase : {
    INFO : 'info',
    PLAYERS : 'players',
    VOTES : 'votes'
  }
}

//Teke the body of the Kimono API response and returns a list of players in the right format
exports.prepare_players = function(body) {
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
    'players': data_array
  };

  return data;
};
