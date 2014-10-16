var isAdmin         = require('./helpers.js').isAdmin;
var isAuthenticated = require('./helpers.js').isAuthenticated;
var getUserRoles    = require('./helpers.js').getUserRoles;
var renderPage      = require('./helpers.js').renderPage;

module.exports = function (app) {
    //sample route
    app.get('/hello', isAuthenticated, function (req, res) {
        getUserRoles(req, res, 'hello');
    });
};