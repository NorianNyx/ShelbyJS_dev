var passportLocal = require('passport-local').Strategy;
var User          = require('../models/user');

module.exports = function (passport) {
    passport.use('local-signup', new passportLocal({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    }, createUser));
    
    passport.use('local-login', new passportLocal({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    }, logUserIn));
    
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    
    function createUser(req, username, password, done) {
        process.nextTick(function () {
            User.findOne({ 'Local.Username' : username }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    var newUser = new User();
                    newUser.Local.Email     = req.body.email;
                    newUser.Local.Username  = username;
                    newUser.Local.Password  = newUser.encryptPassword(password);
                    newUser.save(function (err) {
                        if (err) {
                            throw err;
                        }
                        return true;
                    });
                }
            });
        });
    }
    
    function logUserIn(req, username, password, done) {
        User.findOne({ 'Local.Username' :  username }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'Invalid username or password.'));
            }
            if (!user.validatePassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Invalid username or password.'));
            }
            return done(null, user);
        });
    }
}