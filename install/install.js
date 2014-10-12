var siteInfo = require('../config/site.json');
var fs       = require('fs');
var User     = require('../models/user.js');
var Role     = require('../models/role.js');

module.exports = function (app) {
    app.get('/install', function (req, res) {
        if (!siteInfo.installed) {
            res.render('install', {
                siteInfo: siteInfo
            });
        } else {
            res.redirect('/');
        }
    });
    
    app.post('/install', function (req, res) {
        var siteData = {
            "sitename"  : req.body.sitename,
            "copyright" : req.body.copyright,
            "database"  : {
                "url" : req.body.databaseurl
            },
            "installed" : true
        };
        fs.writeFile('../config/site.json', JSON.stringify(siteData, null, 4), function(err) {
            if (err) {
                res.send(err);
            } else {
                var newRole = new Role();
                newRole.RoleName = 'Administrator';
                newRole.save(function (err, role) {
                    if (err) {
                        res.send(err);
                    } else {
                        var newUser = new User();
                        newUser.Local.Username = req.body.username;
                        newUser.Local.Email    = req.body.email;
                        newUser.Local.Password = newUser.encryptPassword(req.body.password);
                        newUser.Local.Roles    = [ role.RoleID ];
                        newUser.save(function (err) {
                            if (err) {
                                res.send(err);
                            } else {
                                res.status(200).end();
                                process.exit();
                            }
                        });
                    }
                });
            }
        });
    });
};