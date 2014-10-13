$(document).ready(function () {
    editUsers.ajaxGetUserInfos();
});

var editUsers = {
    datatable: {},
    
    ajaxGetUserInfos: function() {
        $('body').addClass('loading');
        var ajaxCall = this.ajaxCall(null, true, '/shelby/getAllUserInfos', 'GET');
        ajaxCall.done(function (users) {
            editUsers.datatable = $('#userTable').DataTable({
                columns: [
                    { title: 'Username', data: 'Username' },
                    { title: 'Firstname', data: 'FirstName' },
                    { title: 'Lastname', data: 'LastName' },
                    { title: 'Email', data: 'Email' },
                    { title: '', data: 'Delete', width: '15px' }
                ],
                data: editUsers.getDataTablesData(users)
            });
            $('body').removeClass('loading');
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
            $('body').addClass('loading');
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
        var ajaxCall = this.ajaxCall(data, true, '/shelby/deleteUser', 'POST');
        ajaxCall.done(function (res) {
            editUsers.ajaxGetUserInfos();
        });
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
    }
}