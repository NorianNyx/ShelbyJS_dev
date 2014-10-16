var isAdmin         = require('./helpers.js').isAdmin;
var isAuthenticated = require('./helpers.js').isAuthenticated;
var getUserRoles    = require('./helpers.js').getUserRoles;
var renderPage      = require('./helpers.js').renderPage;
var fs              = require('fs');

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
            fs.exists('../views/controllers/' + req.params.view.toLowerCase() + '.ejs', function (exists) {
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
            fs.exists('../views/controllers/' + req.url.split('/')[1].toLowerCase() + '.ejs', function (exists) {
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
};