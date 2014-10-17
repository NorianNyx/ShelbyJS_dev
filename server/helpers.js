var gravatar = require('gravatar');
var siteInfo = require('../config/site.json');
var Shelby   = require('./shelby.js');

var helpers = {};

helpers.isAdmin = function (req, res, next) {
    if (req.isAuthenticated()) {
        Shelby.Users.isInRole(req.user.Local.Username, 'Administrator', function (err, isInRole) {
            if (err) {
                res.send(err);
            } else {
                if (isInRole) {
                    next();
                } else {
                    res.redirect('404');
                }
            }
        });
    } else {
        res.redirect('404');
    }
};

helpers.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('loginMessage', 'You must be logged in to do that.');
        res.redirect('/');
    }
};

helpers.getUserRoles = function (req, res, page) {
    Shelby.Users.getUserRolesByUsername(req.user.Local.Username, function (err, roles) {
        var roleNames = [];
        roles.forEach(function (role, index) {
            roleNames.push(role.RoleName);
        });
        helpers.renderPage(req, res, roleNames, page);
    });
};

helpers.renderPage = function (req, res, roles, page) {
    res.render(page, {
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        message : req.flash('loginMessage') + req.flash('signupMessage'),
        siteInfo : siteInfo,
        gravatarUrl: req.isAuthenticated() ? gravatar.url(req.user.Local.Email, { s: '200', r: 'pg' }, true) : '',
        userRoles: roles
    });
};

module.exports = helpers;