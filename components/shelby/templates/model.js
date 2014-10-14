var mongoose      = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var configDB      = require('../../config/site.json').database.url;

var connection    = mongoose.createConnection(configDB);
autoIncrement.initialize(connection);

var xxSchema = new mongoose.Schema({
    xxTitle   : { type: String, default: '' }
});

xxSchema.methods.echo = function (myString) {
    return myString;
};

xxSchema.statics.helloworld = function (callback) {
   return callback(null, 'Hello World');
};

xxSchema.plugin(autoIncrement.plugin, { model: 'XX', field: 'XXID', startAt: 1 });

module.exports = mongoose.model('XX', xxSchema);