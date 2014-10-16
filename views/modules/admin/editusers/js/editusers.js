'use strict';

/* global $ Shelby*/

$(document).ready(function () {
    editUsers.ajaxGetUserInfos();
});

var editUsers = {
    datatable: {},
    
    ajaxGetUserInfos: function() {
        Shelby.loading();
        var ajax = Shelby.ajaxCall(null, true, '/shelby/getAllUserInfos', 'GET');
        ajax.done(function (users) {
            editUsers.datatable = $('#userTable').DataTable({
                columns: [
                    { title: 'Username', data: 'Username' },
                    { title: 'First Name', data: 'FirstName' },
                    { title: 'Last Name', data: 'LastName' },
                    { title: 'Email', data: 'Email' },
                    { title: '', data: 'Delete', width: '15px' }
                ],
                data: editUsers.getDataTablesData(users)
            });
            Shelby.doneLoading();
        });
    },

    getDataTablesData: function (users) {
        var data = [];
        $.each(users, function (i, user) {
            var obj = {};
            obj.Delete = '<a href="#" onclick="editUsers.confirmDeleteUser(\'' + user.Username + '\'); return false;"><span class="glyphicon glyphicon-remove" style="margin-left: 10px; color: #c9302c;"></span></a>';
            $.each(Object.keys(user), function (i, key) {
                obj[key] = user[key];
            });
            data.push(obj);
        });
        return data;
    },

    confirmDeleteUser: function (username) {
        $('#deleteUser_submitBtn').unbind('click').click(function () {
            Shelby.loading();
            $.fancybox.close();
            editUsers.datatable.destroy();
            editUsers.ajaxDeleteUser(username);
        });
        $.fancybox('#confirmDeleteUser', { closeBtn: false });
    },

    ajaxDeleteUser: function (username) {
        var data = {
            username: username
        };
        var ajax = Shelby.ajaxCall(data, true, '/shelby/deleteUser', 'POST');
        ajax.done(function (res) {
            editUsers.ajaxGetUserInfos();
        });
    }
}