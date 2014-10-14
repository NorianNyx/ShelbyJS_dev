var gravatar = require('gravatar');
var fs       = require('fs');
var siteInfo = require('../config/site.json');
var User     = require('../models/shelby/user.js');

module.exports = function (app, passport) {
    app.get('/', function (req, res) {
        if (req.isAuthenticated()) {
            getUserRoles(req, res, 'index');
        } else {
            renderPage(req, res, [], 'index');
        }
    });
    
    app.get('/about', function (req, res) {
        if (req.isAuthenticated()) {
            getUserRoles(req, res, 'about');
        } else {
            renderPage(req, res, [], 'about');
        }
    });
    
    app.get('/profile', isAuthenticated, function (req, res) {
        getUserRoles(req, res, 'profile');
    });
    
    app.get('/adminpanel', isAdmin, function (req, res) {
        getUserRoles(req, res, 'admin/adminpanel');
    });
    
    app.get('/manageroles', isAdmin, function (req, res) {
        getUserRoles(req, res, 'admin/manageroles');
    });
    
    app.get('/editusers', isAdmin, function (req, res) {
        getUserRoles(req, res, 'admin/editusers');
    });
    
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
    
    app.get('/:view', function (req, res) {
        if (req.isAuthenticated()) {
            fs.exists('../views/' + req.params.view + '.ejs', function (exists) {
                if (exists) {
                    getUserRoles(req, res, req.params.view);
                } else {
                    renderPage(req, res, [], '404');
                }
            });
        } else {
            renderPage(req, res, [], '404');
        }
    });
    
    app.get('/*', function (req, res) {
        if (req.isAuthenticated()) {
            fs.exists('../views/' + req.url.split('/')[1] + '.ejs', function (exists) {
                if (exists) {
                    getUserRoles(req, res, req.url.split('/')[1]);
                } else {
                    renderPage(req, res, [], '404');
                }
            }); 
        } else {
            renderPage(req, res, [], '404');
        }
    });
    
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
    }));
    
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
    }));
    
    function isAdmin(req, res, next) {
        if (req.isAuthenticated()) {
            User.isInRole(req.user.Local.Username, 'Administrator', function (err, isInRole) {
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
    }
    
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
            message : req.flash('loginMessage') + req.flash('signupMessage') + req.flash('passwordInvalid'),
            siteInfo : siteInfo,
            gravatarUrl: req.isAuthenticated() ? gravatar.url(req.user.Local.Email, { s: '200', r: 'pg' }, true) : '',
            userRoles: roles
        });
    }
};