var mongoose      = require('mongoose');
var bcrypt        = require('bcrypt-nodejs');
var autoIncrement = require('mongoose-auto-increment');
var configDB      = require('../../config/site.json').database.url;
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
        Roles     : { type: [Number], default: [] }
    }
});

userSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.Local.Password);
};

userSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'UserID', startAt: 1 });

module.exports = mongoose.model('User', userSchema);