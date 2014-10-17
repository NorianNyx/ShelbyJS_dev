var Shelby          = require('../shelby.js');
var isAuthenticated = require('../helpers.js').isAuthenticated;
var fs              = require('fs');

module.exports = function (app) {
    //check to see if this username is taken
    app.get('/shelby/checkUsername', function (req, res) {
        Shelby.Users.getByUsername(req.query.username, function (err, user) {
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
    
    //get the requested user
    app.get('/shelby/getUser', isAdmin, function (req, res) {
        Shelby.Users.getByUsername(req.query.username, function (err, user) {
            if (err) {
                res.send(err);
            } else {
                res.send(user);
            }
        });
    });
    
    //get all users from the DB
    app.get('/shelby/getAllUsers', isAdmin, function (req, res) {
        Shelby.Users.getAllUsers(function (err, users) {
            if (err) {
                res.send(err);
            } else {
                res.send(users);
            }
        });
    });
    
    //get all users from the DB and filter the data
    app.get('/shelby/getAllUserInfos', isAdmin, function (req, res) {
        Shelby.Users.getAllUsers(function (err, users) {
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
    
    //get all roles from the DB and filter the data
    app.get('/shelby/getAllRoleInfos', isAdmin, function (req, res) {
        Shelby.Roles.getAllRoles(function (err, roles) {
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
    
    //get all users in a specified role
    app.get('/shelby/getUsersByRoleName', isAdmin, function (req, res) {
        Shelby.Users.getUsersByRoleName(req.query.rolename, function (err, users) {
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
    
    //add user to specified role
    app.post('/shelby/addUserToRole', isAdmin, function (req, res) {
        Shelby.Users.addToRoleByRoleName(req.body.username, req.body.rolename, function (err, status) {
            if (err) {
                res.send(err);
            } else {
                res.status(status).end();
            }
        });
    });
    
    //create a role
    app.post('/shelby/createRole', isAdmin, function (req, res) {
        Shelby.Roles.addRole(req.body.rolename, function (err, status) {
            if (err) {
                res.send(err);
            } else {
                res.redirect(req.headers.referer);
            }
        });
    });
    
    //create a main view in the /views folder
    app.post('/shelby/createView', isAdmin, function (req, res) {
        fs.exists('../views/controllers/' + req.body.viewname.toLowerCase() + '.ejs', function (exists) {
            if (!exists) {
                var rs = fs.createReadStream('../components/shelby/templates/view.ejs');
                var ws = fs.createWriteStream('../views/controllers/' + req.body.viewname.toLowerCase() + '.ejs');
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
    
    //update the user's profile information (should update to PUT in future revision)
    app.post('/shelby/updateProfile', isAuthenticated, function (req, res) {
        Shelby.Users.getByUsername(req.user.Local.Username, function (err, user) {
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
    
    //update the user's password (should update to PUT in future revision)
    app.post('/shelby/updatePassword', isAuthenticated, function(req, res) {
        Shelby.Users.getByUsername(req.user.Local.Username, function (err, user) {
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
    
    //delete the specified user (should be updated to DELETE in future revision)
    app.post('/shelby/deleteUser', isAdmin, function (req, res) {
        Shelby.Users.getByUsername(req.body.username, function (err, user) {
            if (err) {
                res.send(err);
            } else {
                user.remove();
                res.status(200).end();
            }
        });
    });
    
    //remove a user from a role (should probably be a put, kind of ambiguous)
    app.post('/shelby/removeUserFromRole', isAdmin, function (req, res) {
        Shelby.Users.removeUserFromRole(req.body.username, req.body.rolename, function (err, status) {
            if (err) {
                res.send(err);
            } else {
                res.status(status).end();
            }
        });
    });
    
    //start the process of creating a module
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
    
    //create the main module view file inside of /views/modules
    function createModuleView(res, moduleName) {
        fs.readFile('../components/shelby/templates/module.ejs', 'utf-8', function (err, data) {
            if (err) {
                res.send(err);
            } else {
                data = data.replace(new RegExp('xx', 'g'), moduleName);
                fs.mkdir('../views/modules/' + moduleName, null, function (err) {
                    if (err) {
                        res.send(err);
                    } else {
                        fs.writeFile('../views/modules/' + moduleName + '/' + moduleName + '.ejs', data, 'utf-8', function (err) {
                            if (err) {
                                res.send(err);
                            } else {
                                createComponents(res, moduleName);
                            }
                        });
                    }
                });
            }
        });
    }
    
    //create the component folders/files in /components/modules/<moduleName>
    function createComponents(res, moduleName) {
        fs.mkdir('../views/modules/' + moduleName + '/js', null, function (err) {
            if (err) {
                res.send(err);
            } else {
                fs.mkdir('../views/modules/' + moduleName + '/css', null, function (err) {
                    if (err) {
                        res.send(err);
                    } else {
                        var rs1 = fs.createReadStream('../components/shelby/templates/script.js');
                        var rs2 = fs.createReadStream('../components/shelby/templates/stylesheet.css');
                        var ws1 = fs.createWriteStream('../views/modules/' + moduleName + '/js/' + moduleName + '.js');
                        var ws2 = fs.createWriteStream('../views/modules/' + moduleName + '/css/' + moduleName + '.css');
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
                });
            }
        });
    }
    
    //create the api file inside of the /server/api folder
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
    
    //create a model file inside of /models/<moduleName>
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
    
    //make sure this user is an admin, and return a 401 if not
    function isAdmin(req, res, next) {
        if (req.isAuthenticated()) {
            Shelby.Users.isInRole(req.user.Local.Username, 'Administrator', function (err, isInRole) {
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