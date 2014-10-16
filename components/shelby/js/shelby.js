'use strict';

/* global $ */

var Shelby = {
    loading: function () {
        $('body').addClass('loading');
    },
    
    doneLoading: function () {
        $('body').removeClass('loading');
    },
    
    ajaxCall: function (data, async, url, type) {
        data = data || null;
        var ajax = $.ajax({
            type: type,
            url: url,
            data: data,
            async: async
        });
        return ajax;
    },
    
    getUser: function (username) {
        var data = {
            username: username
        };
        return this.ajaxCall(data, true, '/shelby/getUser', 'GET');
    },
    
    getAllUsers: function () {
        return this.ajaxCall(null, true, '/shelby/getAllUsers', 'GET');
    },
    
    getUsersInRole: function (rolename) {
        var data = {
            rolename: rolename
        };
        return this.ajaxCall(data, true, '/shelby/getUsersByRoleName', 'GET');
    }
}