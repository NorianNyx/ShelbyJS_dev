var mongoose      = require('mongoose');
var bcrypt        = require('bcrypt-nodejs');
var autoIncrement = require('mongoose-auto-increment');
var configDB      = require('../config/site.json').database.url;
var Role          = require('./role.js');

var connection    = mongoose.createConnection(configDB);
autoIncrement.initialize(connection);

var userSchema = new mongoose.Schema({
    Local : {
        FirstName : { type: String, default: '' },
        LastName  : { type: String, default: '' },
        Address   : { type: Object, default: {
            Street : '',
            City   : '',
            State  : '',
            Zip    : ''
        } },
        Email     : { type: String, default: '' },
        Username  : String,
        Password  : String,
        Roles     : { type: Array, default: [] }
    }
});

userSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.Local.Password);
};

userSchema.statics.getByUsername = function (username, callback) {
    this.findOne({ 'Local.Username' : username }, function (err, user) {
        if (err) {
            return callback(err);
        } else {
            return callback(null, user);
        }
    })
};

userSchema.statics.getByID = function (id, callback) {
    this.findOne({ 'UserID' : id }, function (err, user) {
        if (err) {
            return callback(err);
        } else {
            return callback(null, user);
        }
    })
};

userSchema.statics.getAllUsers = function (callback) {
    this.find({}, function (err, users) {
        if (err) {
            return callback(err);
        } else {
            return callback(null, users);
        }
    });
};

userSchema.statics.addRoleByName = function (username, roleName, callback) {
    this.getByUsername(username, function (err, user) {
        if (err) {
            return callback(err);
        } else {
            Role.getRoleByName(roleName, function (err, role) {
                if (err) {
                    return callback(err);
                } else {
                    if (role != null) {
                        if (user.Local.Roles.indexOf(role.RoleID) === -1) {
                            user.Local.Roles.push(role.RoleID);
                            user.save();
                        }
                        return callback(null, 201);
                    } else {
                        return callback(null, 404);
                    }
                }
            });
        }
    });
};

userSchema.statics.getUserRolesByUsername = function (username, callback) {
    this.getByUsername(username, function (err, user) {
        if (err) {
            return callback(err);
        } else {
            Role.getRolesByID(user.Local.Roles, function (err, roles) {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, roles);
                }
            });
        }
    });
};

userSchema.statics.isInRole = function (username, roleName, callback) {
    this.getByUsername(username, function (err, user) {
        if (err) {
            return callback(err);
        } else {
            Role.getRolesByID(user.Local.Roles, function (err, roles) {
                if (err) {
                    return callback(err);
                } else {
                    var inRole = false;
                    roles.forEach(function (role, index) {
                        if (role.RoleName === roleName) {
                            inRole = true;
                        }
                    });
                    return callback(null, inRole);
                }
            });
        }
    });
};

userSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'UserID', startAt: 1 });

module.exports = mongoose.model('User', userSchema);