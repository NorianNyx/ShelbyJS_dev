var User = require('../../models/user.js');
var Role = require('../../models/role.js');
var fs   = require('fs');

module.exports = function (app) {
    app.get('/shelby/checkUsername', function (req, res) {
        User.getByUsername(req.query.username, function (err, user) {
            if (err) {
                res.send(err);
            }
            if (user) {
                res.send(false);
            } else {
                res.send(true);
            }
        });
    });
    
    app.get('/shelby/getAllUsers', isAdmin, function (req, res) {
        User.getAllUsers(function (err, users) {
            if (err) {
                res.send(err);
            } else {
                res.send(users);
            }
        });
    });
    
    app.get('/shelby/getAllUserInfos', isAdmin, function (req, res) {
        User.getAllUsers(function (err, users) {
            if (err) {
                res.send(err);
            } else {
                var userInfos = [];
                users.forEach(function (user, i) {
                    userInfos.push({ 
                        Username: user.Local.Username, 
                        FirstName: user.Local.FirstName,
                        LastName: user.Local.LastName,
                        Email: user.Local.Email
                    });
                });
                res.send(userInfos);
            }
        });
    });
    
    app.get('/shelby/getAllRoleInfos', isAdmin, function (req, res) {
        Role.getAllRoles(function (err, roles) {
            if (err) {
                res.send(err);
            } else {
                var roleInfos = [];
                roles.forEach(function (role, i) {
                    roleInfos.push({
                        RoleName: role.RoleName
                    });
                });
                res.send(roleInfos);
            }
        });
    });
    
    app.get('/shelby/getUsersByRoleName', isAdmin, function (req, res) {
        User.getUsersByRoleName(req.query.rolename, function (err, users) {
            if (err) {
                res.send(err);
            } else {
                var userInfos = [];
                users.forEach(function (user, i) {
                    userInfos.push({ 
                        Username: user.Local.Username, 
                        FirstName: user.Local.FirstName,
                        LastName: user.Local.LastName,
                        Email: user.Local.Email
                    });
                });
                res.send(userInfos);
            }
        });
    });
    
    app.post('/shelby/addUserToRole', isAdmin, function (req, res) {
        User.addRoleByName(req.body.username, req.body.rolename, function (err, status) {
            if (err) {
                res.send(err);
            } else {
                res.status(status).end();
            }
        });
    });
    
    app.post('/shelby/createRole', isAdmin, function (req, res) {
        Role.addRole(req.body.rolename, function (err, status) {
            if (err) {
                res.send(err);
            } else {
                res.redirect(req.headers.referer);
            }
        });
    });
    
    app.post('/shelby/createView', isAdmin, function (req, res) {
        fs.exists('../views/' + req.body.viewname.toLowerCase() + '.ejs', function (exists) {
            if (!exists) {
                var rs = fs.createReadStream('../components/shelby/templates/view.ejs');
                var ws = fs.createWriteStream('../views/' + req.body.viewname.toLowerCase() + '.ejs');
                rs.on('error', function (err) {
                    res.send(err);
                });
                ws.on('error', function (err) {
                    res.send(err);
                });
                rs.pipe(ws);
            }
            res.redirect('/' + req.body.viewname.toLowerCase());
        });
    });
    
    app.post('/shelby/updateProfile', isAuthenticated, function (req, res) {
        User.getByUsername(req.user.Local.Username, function (err, user) {
            if (err) {
                res.send(err);
            } else {
                user.Local.FirstName = req.body.firstname;
                user.Local.LastName = req.body.lastname;
                user.Local.Email = req.body.email;
                user.Local.Address = {
                    Street: req.body.street,
                    City: req.body.city,
                    State: req.body.state,
                    Zip: req.body.zip
                };
                user.save();
                res.redirect('/profile');
            }
        });
    });
    
    app.post('/shelby/updatePassword', isAuthenticated, function(req, res) {
        User.getByUsername(req.user.Local.Username, function (err, user) {
            if (err) {
                res.send(err);
            } else {
                if (user.validatePassword(req.body.password)) {
                    user.Local.Password = user.encryptPassword(req.body.newpassword);
                    user.save();
                    res.redirect('/profile');
                } else {
                    req.flash('passwordInvalid', 'The password you provided was incorrect. Your password has not been changed.');
                    res.redirect('/profile');
                }
            }
        });
    });
    
    app.post('/shelby/deleteUser', isAdmin, function (req, res) {
        User.getByUsername(req.body.username, function (err, user) {
            if (err) {
                res.send(err);
            } else {
                user.remove();
                res.status(200).end();
            }
        });
    });
    
    app.post('/shelby/removeUserFromRole', isAdmin, function (req, res) {
        User.removeUserFromRole(req.body.username, req.body.rolename, function (err, status) {
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