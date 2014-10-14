var mongoose      = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var configDB      = require('../../config/site.json').database.url;

var connection    = mongoose.createConnection(configDB);
autoIncrement.initialize(connection);

var roleSchema = new mongoose.Schema({
    RoleName : { type: String, default: '' }
});

roleSchema.statics.addRole = function (roleName, callback) {
    var newRole = new this();
    this.getRoleByName(roleName, function (err, role) {
        if (role === null) {
            newRole.RoleName = roleName;
            newRole.save(function (err) {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, 201);
                }
            });
        } else {
            return callback(null, 201);
        }
    });
};

roleSchema.statics.getRolesByID = function (roleIDs, callback) {
    this.find({ 'RoleID' : { $in: roleIDs }}, function (err, roles) {
        if (err) {
            return callback(err);
        } else {
            return callback(null, roles);
        }
    });
};

roleSchema.statics.getRoleByID = function (roleID, callback) {
    this.findOne({ 'RoleID' : roleID }, function (err, role) {
        if (err) {
            return callback(err);
        } else {
            return callback(null, role);
        }
    });
};

roleSchema.statics.getRoleByName = function (roleName, callback) {
    this.findOne({ 'RoleName' : roleName }, function (err, role) {
        if (err) {
            return callback(err);
        } else {
            return callback(null, role);
        }
    });
};

roleSchema.statics.getAllRoles = function (callback) {
    this.find({}, function (err, roles) {
        if (err) {
            return callback(err);
        } else {
            return callback(null, roles);
        }
    })
};

roleSchema.plugin(autoIncrement.plugin, { model: 'Role', field: 'RoleID', startAt: 1 });

module.exports = mongoose.model('Role', roleSchema);