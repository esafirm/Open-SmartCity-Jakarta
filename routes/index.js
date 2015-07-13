
/* URLS */
var haltebus = 'http://smartcity.jakarta.go.id/ajax/apps_command.php?Z2V0SGFsdGVCdXN3YXl+MjAxNTA3MTNTbTRSVEMxdFk=';

/* --------------- */
var request = require('request');
var storage = require('node-persist');
var moment = require('moment');

storage.initSync();
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
	res.json(data);
}

exports.clearData = function(req, res){
	storage.clearSync();

	var data = {
		status: 'OK',
		message: 'Data cleared!'
	}
	res.json(data);
}

exports.haltebus = function(req,res){

	var lastRequestedDate = storage.getItem('halteDate');
	var items = storage.getItem('halte');

	if(items && isToday(lastRequestedDate)){
		console.log('return from persistent!');
		res.end(items);
	}else{
		/* Request first */
		doRequest(haltebus, function(error,response, body){
			if (!error && response.statusCode == 200) {
				storage.setItem('halte', body);
				storage.setItem('halteDate', Date());
				res.end(body);
			}
		});
	}
}	 

function doRequest(url, callback){
	console.log('Making requst:' + url);
	request(url, function(error, response, body){
		callback(error,response, body);
	});
}

function isToday(lastRequestedDate){
	console.log("Date now: " + Date());
	console.log("Date last requested: " + lastRequestedDate)
	return lastRequestedDate ? moment(lastRequestedDate, 'days').isSame(moment(Date(),'days')) : false;
}