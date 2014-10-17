var mongoose      = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var configDB      = require('../../config/site.json').database.url;

var connection    = mongoose.createConnection(configDB);
autoIncrement.initialize(connection);

var roleSchema = new mongoose.Schema({
    RoleName : { type: String, default: '' }
});

roleSchema.plugin(autoIncrement.plugin, { model: 'Role', field: 'RoleID', startAt: 1 });

module.exports = mongoose.model('Role', roleSchema);