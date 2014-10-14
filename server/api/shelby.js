var User     = require('../../models/shelby/user.js');
var Role     = require('../../models/shelby/role.js');
var fs       = require('fs');

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
    
    app.post('/shelby/createModule', isAdmin, function (req, res) {
        var moduleName = req.body.modulename.toLowerCase();
        fs.exists('../views/modules/' + moduleName + '.ejs', function (exists) {
            if (!exists) {
                createModuleView(res, moduleName);
            } else {
                res.status(304).end();
            }
        });
    });
    
    function createModuleView(res, moduleName) {
        fs.readFile('../components/shelby/templates/module.ejs', 'utf-8', function (err, data) {
            if (err) {
                res.send(err);
            } else {
                data = data.replace(new RegExp('xx', 'g'), moduleName);
                fs.writeFile('../views/modules/' + moduleName + '.ejs', data, 'utf-8', function (err) {
                    if (err) {
                        res.send(err);
                    } else {
                        createComponents(res, moduleName);
                    }
                });
            }
        });
    }
    
    function createComponents(res, moduleName) {
        fs.mkdir('../components/modules/' + moduleName, null, function (err) {
            if (err) {
                res.send(err);
            } else {
                fs.mkdir('../components/modules/' + moduleName + '/js', null, function (err) {
                    if (err) {
                        res.send(err);
                    } else {
                        fs.mkdir('../components/modules/' + moduleName + '/css', null, function (err) {
                            if (err) {
                                res.send(err);
                            } else {
                                var rs1 = fs.createReadStream('../components/shelby/templates/script.js');
                                var rs2 = fs.createReadStream('../components/shelby/templates/stylesheet.css');
                                var ws1 = fs.createWriteStream('../components/modules/' + moduleName + '/js/' + moduleName + '.js');
                                var ws2 = fs.createWriteStream('../components/modules/' + moduleName + '/css/' + moduleName + '.css');
                                rs1.on('error', function (err) {
                                    res.send(err);
                                });
                                rs2.on('error', function (err) {
                                    res.send(err);
                                });
                                ws1.on('error', function (err) {
                                    res.send(err);
                                });
                                ws2.on('error', function (err) {
                                    res.send(err);
                                });
                                rs1.pipe(ws1);
                                rs2.pipe(ws2);
                                createApi(res, moduleName);
                            }
                        })
                    }
                })
            }
        })
    }
    
    function createApi(res, moduleName) {
        fs.readFile('../components/shelby/templates/api.js', 'utf-8', function (err, data) {
            if (err) {
                res.send(err);
            } else {
                data = data.replace(new RegExp('xx', 'g'), moduleName);
                fs.writeFile('../server/api/' + moduleName + '.js', data, 'utf-8', function (err) {
                    if (err) {
                        res.send(err);
                    } else {
                        createModel(res, moduleName);
                    }
                });
            }
        });
    }
    
    function createModel(res, moduleName) {
        fs.readFile('../components/shelby/templates/model.js', 'utf-8', function (err, data) {
            if (err) {
                res.send(err);
            } else {
                data = data.replace(new RegExp('xx', 'g'), moduleName);
                data = data.replace(new RegExp('XX', 'g'), moduleName.charAt(0).toUpperCase() + moduleName.slice(1));
                fs.mkdir('../models/' + moduleName, null, function (err) {
                    if (err) {
                        res.send(err);
                    } else {
                        fs.writeFile('../models/' + moduleName + '/' + moduleName + '.js', data, 'utf-8', function (err) {
                            if (err) {
                                res.send(err);
                            } else {
                                res.redirect(res.req.headers.referer);
                            }
                        });
                    }
                });
            }
        });
    }
    
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