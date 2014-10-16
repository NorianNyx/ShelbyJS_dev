var Post            = require('../../models/blog/post.js');
var User            = require('../../models/shelby/user.js');
var isAuthenticated = require('../helpers.js').isAuthenticated;
var sanitizer       = require('sanitize-html');

module.exports = function (app) {
    //get all blog posts from the DB
    app.get('/blog/getPosts', isAuthenticated, function (req, res) {
        Post.getAllPosts(function (err, posts) {
            if (err) {
                res.send(err);
            } else {
                res.send(posts);
            }
        });
    });
    
    //add a post to the DB
    app.post('/blog/addPost', isAdmin, function (req, res) {
        var content = sanitizer(req.body.content, {
            allowedTags: sanitizer.defaults.allowedTags.concat([ 'img' ]),
            allowedAttributes: {
                'img': sanitizer.defaults.allowedAttributes.img.concat([ 'style', 'alt' ])
            }
        });
        Post.addPost(req.body.title, content, req.user.Local.Username, function (err, status) {
            if (err) {
                res.send(err);
            } else {
                res.status(status).end();
            }
        });
    });
    
    app.put('/blog/editPost', isAdmin, function (req, res) {
        var content = sanitizer(req.body.content, {
            allowedTags: sanitizer.defaults.allowedTags.concat([ 'img' ]),
            allowedAttributes: {
                'img': sanitizer.defaults.allowedAttributes.img.concat([ 'style', 'alt' ])
            }
        });
        Post.getPost(req.body.postId, function (err, post) {
            if (err) {
                res.send(err);
            } else {
                post.PostContent = content;
                post.save(function (err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.status(200).end();
                    }
                });
            }
        });
    });
    
    app.delete('/blog/deletePost', isAdmin, function (req, res) {
        Post.getPost(req.body.postId, function (err, post) {
            if (err) {
                res.send(err);
            } else {
                post.remove(function (err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.status(200).end();
                    }
                });
            }
        });
    });
    
    //make sure this user is an admin, and return a 401 if not
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