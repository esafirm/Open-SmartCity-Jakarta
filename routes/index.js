
/* URLS */
var haltebus = 'http://smartcity.jakarta.go.id/ajax/apps_command.php?Z2V0SGFsdGVCdXN3YXl+MjAxNTA3MTNTbTRSVEMxdFk=';
var kepolisian = 'http://smartcity.jakarta.go.id/ajax/apps_command.php?Z2V0UG9zUG9saXNpfjIwMTUwNzEzU200UlRDMXRZ';
var rumahSakit = 'http://smartcity.jakarta.go.id/ajax/apps_command.php?Z2V0UlNLbGluaWt+MjAxNTA3MTNTbTRSVEMxdFk=';
var sekolah = 'http://smartcity.jakarta.go.id/ajax/apps_command.php?Z2V0U2Vrb2xhaH4yMDE1MDcxM1NtNFJUQzF0WQ==';
var tempatIbadah = 'http://smartcity.jakarta.go.id/ajax/apps_command.php?Z2V0SWJhZGFofjIwMTUwNzEzU200UlRDMXRZ';
var lokasiTransportasi = 'http://smartcity.jakarta.go.id/ajax/apps_command.php?Z2V0VHJhbnNwb3J0YXNpfjIwMTUwNzEzU200UlRDMXRZ';

/* Pariwisata & Kebudayaan */
var lokasiKuliner = 'http://smartcity.jakarta.go.id/ajax/apps_command.php?Z2V0S3VsaW5lcn4yMDE1MDczMFNtNFJUQzF0WQ==';
var lokasiWisata = 'http://smartcity.jakarta.go.id/ajax/apps_command.php?Z2V0V2lzYXRhfjIwMTUwNzMwU200UlRDMXRZ';
var lokasiBelanja = 'http://smartcity.jakarta.go.id/ajax/apps_command.php?Z2V0QmVsYW5qYX4yMDE1MDczMFNtNFJUQzF0WQ==';
var lokasiPatung = 'http://smartcity.jakarta.go.id/ajax/apps_command.php?Z2V0UGF0dW5nfjIwMTUwNzMwU200UlRDMXRZ';
var lokasiMuseum = 'http://smartcity.jakarta.go.id/ajax/apps_command.php?Z2V0TXVzZXVtfjIwMTUwNzMwU200UlRDMXRZ';

/* Dinas Kebersihan */
var lokasiTPS = 'http://smartcity.jakarta.go.id/ajax/apps_command.php?Z2V0VFBTfjIwMTUwODAyU200UlRDMXRZ';

/* KUMKMP */
var lokasiPasar = 'http://smartcity.jakarta.go.id/ajax/apps_command.php?Z2V0S1VNS01QX1Bhc2FyfjIwMTUwODAyU200UlRDMXRZ';

/* Busway Tracking */
var buswayTracking = 'http://202.51.116.138:8088/jsc.asp?rq=jakartasmartcity&id=476A837BE937ED73';

var URLs = [
  {"name":"haltebus", "url":haltebus},
  {"name":"kepolisian", "url":kepolisian},
  {"name":"rumahSakit", "url":rumahSakit},
  {"name":"sekolah", "url":sekolah},
  {"name":"tempatIbadah", "url":tempatIbadah},
  {"name":"lokasiTransportasi", "url":lokasiTransportasi},

  /* Pariwisata */
  {"name":"lokasiKuliner", "url":lokasiKuliner},
  {"name":"lokasiWisata", "url":lokasiWisata},
  {"name":"lokasiBelanja", "url":lokasiBelanja},
  {"name":"lokasiPatung", "url":lokasiPatung},
  {"name":"lokasiMuseum", "url":lokasiMuseum},

  /* Dinas Kebersihan */
  {"name":"lokasiTPS", "url":lokasiTPS},

  /* KUMKMP */
  {"name":"lokasiPasar", "url":lokasiPasar}
];

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
  };
  res.json(data);
};

exports.clearData = function(req, res){
  storage.clearSync();

  var data = {
    status: 'OK',
    message: 'Data cleared!'
  };
  res.json(data);
};

exports.grabAllData = function(req, res){
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('fethcing...');

  var counter = 0;

  URLs.forEach(function(item){

    var name = item.name;
    var url = item.url;

    doRequest(url, function(error,response, body){
      if(!error && response.statusCode == 200){
        console.log('Request success for :' + name);
        res.write('<br>Request <b style="color:green">success</b> for : ' + name);
        onRequestSuccess(name, body);
      }else{
        console.log('Response error',response);
        res.write('<br>Request <b style="color:red">error</b> for : ' + name);
      }

      counter++;
      if(URLs.length === counter)
        res.end('<br>Get all data completed ...');
    });
  });
};

exports.get = function(req, res){
  doAPIRequest(getKeyFromPath(req.route.path),req,res);
};

function getKeyFromPath(path){
  return path.substring(path.lastIndexOf('/') + 1);
}

function getURLfromKey(key){
  for (var i = 0; i < URLs.length; i++)
    if(URLs[i].name.toLowerCase() === key.toLowerCase())
      return URLs[i].url;
}

function doAPIRequest(key,req,res){
  var lastRequestedDate = storage.getItem(key + 'Date');
  var items = storage.getItem(key);

  // console.log(req);

  var query = req.query;
  var limit = query.limit || 9999;
  var offset = query.offset || 0;
  var hasQuery = query.q;

  console.log('requesting ' + key + ' with offset ' + offset + ' and limit ' + limit);

  if(items && isToday(lastRequestedDate)){
    console.log('return from persistent!');

      if(limit !== 9999 || offset !== 0 || hasQuery){
        var json = JSON.parse(items);

        if(hasQuery){
          var q = [];
          Object.keys(query.q).forEach(function(item){
            q.push({name:item, value: hasQuery[item]});
          });

          if(q.length > 0){
            console.log('query', q);
            json = json.filter(function(value){
              return evaluateFilter(value, q);
            });
          }
        }

        res.json(json.slice(offset, parseInt(offset) + parseInt(limit)));
      }else
        res.end(items);

  }else{
    doRequest(getURLfromKey(key), function(error,response, body){
      if (!error && response.statusCode == 200) {
        onRequestSuccess(key, body);
        res.end(body);
      }else if(items){
        res.end(items);
      }
    });
  }
}

function evaluateFilter(value, q){
  var isTrue = true;
  try{
    q.forEach(function(param){
      if(value[param.name] !== param.value){
        isTrue = false;
        throw BreakException;
      }
    });
  }catch(e){}
  return isTrue;
}

function onRequestSuccess(key ,body){
  if(isJsonString(body) && body.length > 20){
    storage.setItem(key.toLowerCase(), body);
    storage.setItem(key.toLowerCase() + 'Date', Date());
  }
}

function doRequest(url, callback){
  console.log('Making request:' + url);
  request(url, function(error, response, body){
    callback(error,response, body);
  });
}

function isToday(lastRequestedDate){
  console.log("Date now: " + Date());
  console.log("Date last requested: " + lastRequestedDate);
  return lastRequestedDate ? moment(lastRequestedDate, 'days').isSame(moment(Date(),'days')) : false;
}

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
