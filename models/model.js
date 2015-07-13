var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var personSchema = new Schema({
	name: String,
	locationGeo : { type: [Number], index: { type: '2dsphere', sparse: true } },
	locationName : String,	
	dateAdded : { type: Date, default: Date.now },
})

// export 'Person' model so we can interact with it in other files
module.exports = mongoose.model('Person',personSchema);