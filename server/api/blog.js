var Post = require('../../models/post.js');
var User = require('../../models/user.js');

module.exports = function (app) {
    app.get('/blog/getPosts', isAuthenticated, function (req, res) {
        Post.getAllPosts(function (err, posts) {
            if (err) {
                res.send(err);
            } else {
                res.send(posts);
            }
        });
    });
    
    app.post('/blog/addPost', isAdmin, function (req, res) {
        Post.addPost(req.body.title, req.body.content, req.user.Local.Username, function (err, status) {
            if (err) {
                res.send(err);
            } else {
                res.status(status).end();
            }
        });
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