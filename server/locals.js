module.exports = function (app) {
    app.locals.isInRole = function (role) {
        return this.userRoles.indexOf(role) > -1;
    };
    
    app.locals.isInAnyRole = function (roles) {
        var locals = this;
        return roles.filter(function (role) {
            return locals.userRoles.indexOf(role) > -1;
        }).length > 0;
    };
    
    app.locals.isInAllRoles = function (roles) {
        var locals = this;
        return roles.filter(function (role) {
            return locals.userRoles.indexOf(role) > -1;
        }).length == roles.length;
    };
};