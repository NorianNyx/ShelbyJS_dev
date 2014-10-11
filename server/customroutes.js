var gravatar = require('gravatar');
var siteInfo = require('../config/site.json');
var User     = require('../models/user.js');
var helpers  = require('../server/helpers.js');

module.exports = function (app, passport) {
    function isAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            req.flash('loginMessage', 'You must be logged in to do that.');
            res.redirect('/');
        }
    }
    
    function getUserRoles(req, res, page) {
        User.getUserRolesByUsername(req.user.Local.Username, function (err, roles) {
            var roleNames = [];
            roles.forEach(function (role, index) {
                roleNames.push(role.RoleName);
            });
            renderPage(req, res, roleNames, page);
        });
    }
    
    function renderPage(req, res, roles, page) {
        res.render(page, {
            isAuthenticated: req.isAuthenticated(),
            user: req.user,
            message : req.flash('loginMessage') + req.flash('signupMessage'),
            siteInfo : siteInfo,
            gravatarUrl: req.isAuthenticated() ? gravatar.url(req.user.Local.Email, { s: '200', r: 'pg' }, true) : '',
            userRoles: roles
        });
    }
};