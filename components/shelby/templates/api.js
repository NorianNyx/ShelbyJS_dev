var User = require('../../models/shelby/user.js');

module.exports = function (app) {
    app.get('/xx/helloworld', isAuthenticated, function (req, res) {
        res.send('Hello World');
    });
    
    app.post('/xx/helloworld', isAdmin, function (req, res) {
        res.status(200).end();
    });
    
    function isAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            req.flash('loginMessage', 'You must be logged in to do that.');
            res.redirect('/');
        }
    }
    
    function isAdmin(req, res, next) {
        if (req.isAuthenticated()) {
            User.isInRole(req.user.Local.Username, 'Administrator', function (err, isInRole) {
                if (err) {
                    res.send(err);
                } else {
                    if (isInRole) {
                        next();
                    } else {
                        res.status(401).end();
                    }
                }
            });
        } else {
            res.status(401).end();
        }
    }
};