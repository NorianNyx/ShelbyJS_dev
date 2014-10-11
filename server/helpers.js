module.exports = function (app) {
    app.locals.isInRole = function (userRoles, role) {
        return userRoles.indexOf(role) > -1;
    }
    
    app.locals.isInAnyRole = function (userRoles, roles) {
        return roles.filter(function (role) {
            return userRoles.indexOf(role) > -1;
        }).length > 0;
    }
    
    app.locals.isInAllRoles = function (userRoles, roles) {
        return roles.filter(function (role) {
            return userRoles.indexOf(role) > -1;
        }).length == roles.length;
    }
};