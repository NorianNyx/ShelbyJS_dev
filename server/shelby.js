var User = require('../models/shelby/user.js');
var Role = require('../models/shelby/role.js');

var Shelby = {
    Users: {
        getByUsername: function (username, callback) {
            User.findOne({ 'Local.Username' : username }, function (err, user) {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, user);
                }
            });
        },
        
        getByID: function (id, callback) {
            User.findOne({ 'UserID' : id }, function (err, user) {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, user);
                }
            });
        },
        
        getAllUsers: function (callback) {
            User.find({}, function (err, users) {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, users);
                }
            });
        },
        
        addToRoleByRoleName: function (username, roleName, callback) {
            Shelby.Users.getByUsername(username, function (err, user) {
                if (err) {
                    return callback(err);
                } else {
                    if (user != null) {
                        Shelby.Roles.getRoleByName(roleName, function (err, role) {
                            if (err) {
                                return callback(err);
                            } else {
                                if (role !== null) {
                                    if (user.Local.Roles.indexOf(role.RoleID) === -1) {
                                        user.Local.Roles.push(role.RoleID);
                                        user.save();
                                    }
                                    return callback(null, 201);
                                } else {
                                    return callback(null, 404);
                                }
                            }
                        });
                    } else {
                        return callback(null, 404);
                    }
                }
            });
        },
        
        getUsersByRoleName: function (roleName, callback) {
            Shelby.Roles.getRoleByName(roleName, function (err, role) {
                if (err) {
                    return callback(err);
                } else {
                    if (role !== null) {
                        User.find({ 'Local.Roles' : role.RoleID }, function (err, users) {
                            if (err) {
                                return callback(err);
                            } else {
                                return callback(null, users);
                            }
                        });
                    } else {
                        return callback(null, []);
                    }
                }
            });
        },
        
        getUserRolesByUsername: function (username, callback) {
            Shelby.Users.getByUsername(username, function (err, user) {
                if (err) {
                    return callback(err);
                } else {
                    if (user !== null) {
                        Shelby.Roles.getRolesByID(user.Local.Roles, function (err, roles) {
                            if (err) {
                                return callback(err);
                            } else {
                                return callback(null, roles);
                            }
                        });
                    } else {
                        return callback(null, []);
                    }
                }
            });
        },
        
        isInRole: function (username, roleName, callback) {
            Shelby.Users.getByUsername(username, function (err, user) {
                if (err) {
                    return callback(err);
                } else {
                    if (user !== null) {
                        Shelby.Roles.getRolesByID(user.Local.Roles, function (err, roles) {
                            if (err) {
                                return callback(err);
                            } else {
                                var inRole = false;
                                roles.forEach(function (role, index) {
                                    if (role.RoleName === roleName) {
                                        inRole = true;
                                    }
                                });
                                return callback(null, inRole);
                            }
                        });
                    } else {
                        return callback(null, false);
                    }
                }
            });
        },
        
        removeUserFromRole: function (username, roleName, callback) {
            Shelby.Users.getByUsername(username, function (err, user) {
                if (err) {
                    return callback(err);
                } else {
                    if (user !== null) {
                        Shelby.Roles.getRoleByName(roleName, function (err, role) {
                            if (err) {
                                return callback(err);
                            } else {
                                if (user.Local.Roles.indexOf(role.RoleID) > -1) {
                                    user.Local.Roles.splice(user.Local.Roles.indexOf(role.RoleID), 1);
                                    user.save(function (err) {
                                        if (err) {
                                            return callback(err);
                                        } else {
                                            return callback(null, 200);
                                        }
                                    });
                                } else {
                                    return callback(null, 404);
                                }
                            }
                        });
                    } else {
                        return callback(null, 404);
                    }
                }
            });
        }
    },
    
    Roles: {
        addRole: function (roleName, callback) {
            var newRole = new Role();
            Shelby.Roles.getRoleByName(roleName, function (err, role) {
                if (role === null) {
                    newRole.RoleName = roleName;
                    newRole.save(function (err) {
                        if (err) {
                            return callback(err);
                        } else {
                            return callback(null, 201);
                        }
                    });
                } else {
                    return callback(null, 201);
                }
            });
        },
        
        getRolesByID: function (roleIDs, callback) {
            Role.find({ 'RoleID' : { $in: roleIDs }}, function (err, roles) {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, roles);
                }
            });
        },
        
        getRoleByID: function (roleID, callback) {
            Role.findOne({ 'RoleID' : roleID }, function (err, role) {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, role);
                }
            });
        },
        
        getRoleByName: function (roleName, callback) {
            Role.findOne({ 'RoleName' : roleName }, function (err, role) {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, role);
                }
            });
        },
        
        getAllRoles: function (callback) {
            Role.find({}, function (err, roles) {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, roles);
                }
            });
        }
    }
};

module.exports = Shelby;