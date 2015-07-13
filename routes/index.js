
/* URLS */
var haltebus = 'http://smartcity.jakarta.go.id/ajax/apps_command.php?Z2V0SGFsdGVCdXN3YXl+MjAxNTA3MTNTbTRSVEMxdFk=';


var request = require('request');

/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */

 exports.index = function(req, res) {

 	console.log("main route requested");

 	var data = {
 		status: 'OK',
 		message: 'Welcome to Open SmartCity Jakarta API'
 	}

	// respond back with the data
	res.json(data);
}

exports.haltebus = function(req,res){

	request(haltebus, function (error, response, body) {	
		if (!error && response.statusCode == 200) {
			res.end(body);
		}
	});
}