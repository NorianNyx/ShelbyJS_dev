$(function () {
    var ajaxCall = callAPI(null, true, '/shelby/getAllUsers');
    ajaxCall.done(function (users) {
        var columns = [{ title: 'Username' }, { title : 'Email' }];
        var data = [['Nyx', 'askingwillis@aim.com'], ['NorianNyx', 'askingwillis@aim.com']];
        $('#userTable').dataTable({
            columns: columns,
            data: data
        });
    });
    
    function callAPI(data, async, url, type) {
        data = data || null;
        var ajax = $.ajax({
            type: type,
            url: url,
            data: data,
            async: async
        });
        return ajax;
    }
});