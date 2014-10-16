'use strict';

/* global $ Shelby */

$(document).ready(function () {
    manageRoles.getRoleInfo();
});

var manageRoles = {
    datatable: {},
    
    getRoleInfo: function () {
        Shelby.loading();
        var ajax = Shelby.ajaxCall(false, true, '/shelby/getAllRoleInfos', 'GET');
        ajax.done(function (roles) {
            $('#roleTable').DataTable({
                columns: [
                    { title: 'Role Name', data: 'RoleName' },
                    { title: '', data: 'ManageUser', width: '15px' }
                ],
                data: manageRoles.getRoleDataTablesData(roles)
            });
            Shelby.doneLoading();
        });
    },
    
    getRoleDataTablesData: function (roles) {
        var data = [];
        $.each(roles, function (i, role) {
            var obj = {};
            obj.ManageUser = '<a href="#" onclick="manageRoles.addUsersToRole(\'' + role.RoleName + '\'); return false;"><span class="glyphicon glyphicon-pencil" style="margin-left: 10px;"></span></a>';
            $.each(Object.keys(role), function (i, key) {
                obj[key] = role[key];
            });
            data.push(obj);
        });
        return data;
    },
    
    addUsersToRole: function (roleName) {
        Shelby.loading();
        var data = {
            rolename: roleName
        };
        var ajax = Shelby.ajaxCall(data, true, '/shelby/getUsersByRoleName', 'GET');
        ajax.done(function (users) {
            manageRoles.datatable = $('#userRolesTable').DataTable({
                columns: [
                    { title: 'Username', data: 'Username' },
                    { title: 'Firstname', data: 'FirstName' },
                    { title: 'Lastname', data: 'LastName' },
                    { title: 'Email', data: 'Email' },
                    { title: '', data: 'Remove' }
                ],
                data: manageRoles.getUserRoleDataTablesData(users)
            });
            $('#roleName').html('').html(roleName);
            manageRoles.getAllUsers();
        });
    },
    
    addUserToRole: function () {
        var data = {
            rolename: $('#roleName').html(),
            username: $('#slctUser').val()
        };
        var ajax = Shelby.ajaxCall(data, true, '/shelby/addUserToRole', 'POST');
        ajax.done(function () {
            window.location.reload();
        });
    },
    
    getUserRoleDataTablesData: function (users) {
        var data = [];
        $.each(users, function (i, user) {
            var obj = {};
            obj.Remove = '<a href="#" onclick="manageRoles.removeUserFromRole(\'' + user.Username + '\'); return false;"><span class="glyphicon glyphicon-remove" style="margin-left: 10px; color: #c9302c;"></span></a>';
            $.each(Object.keys(user), function (i, key) {
                obj[key] = user[key];
            });
            data.push(obj);
        });
        return data;
    },
    
    getAllUsers: function () {
        var ajax = Shelby.ajaxCall(null, true, '/shelby/getAllUsers', 'GET');
        ajax.done(function (users) {
            $('#slctUser').html('<option>--Select User--</option>');
            $.each(users, function (i, user) {
                $('#slctUser').append('<option>' + user.Local.Username + '</option>');
            });
            $.fancybox('#userRoles', { 
                closeBtn: false,
                afterClose: function () {
                    manageRoles.datatable.destroy();
                }
            });
            Shelby.doneLoading();
        });
    },
    
    removeUserFromRole: function (username) {
        var data = {
            rolename: $('#roleName').html(),
            username: username
        };
        var ajax = Shelby.ajaxCall(data, true, '/shelby/removeUserFromRole', 'POST');
        ajax.done(function () {
            window.location.reload();
        });
    }
};