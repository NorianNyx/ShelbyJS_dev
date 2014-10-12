'use strict';

/* global CKEDITOR $ */

$(function () {
    getAllPosts();
    
    $('#addPost_btn').click(function () {
        $('#ckeditor').ckeditor();
    });
    
    $('#addPost_cancelBtn').click(function () {
        var editor = $('#ckeditor').ckeditor().editor;
        editor.destroy();
    });
    
    $('#addPost_submitBtn').click(function () {
        var data = {
            title: $('#addPost_title').val(),
            content: $('#ckeditor').val()
        };
        var ajax = ajaxCall(data, true, '/blog/addPost', 'POST');
        ajax.done(function () {
            $('#blogArea').empty();
            getAllPosts();
            $('#addPost_cancelBtn').click();
        });
    });
    
    function getAllPosts() {
        $('body').addClass('loading');
        var ajax = ajaxCall(null, true, '/blog/getPosts', 'GET');
        ajax.done(function (posts) {
            posts = posts.sort(function (a, b) {
                return a.PostID < b.PostID;
            });
            $.each(posts, function (i, post) {
                var postEle = $('<div class="col-sm-8 col-md-10">').appendTo('#blogArea');
                var dateCreated = new Date(post.DateCreated);
                var date = dateCreated.getMonth() + 1 + '/' + dateCreated.getDate() + '/' + dateCreated.getFullYear();
                $(postEle).append('<p class="pull-right">Posted by ' + post.CreatedBy + ' on ' + date +'</p>');
                $(postEle).append('<h4>' + post.PostTitle + '</h4>');
                $(postEle).append('<hr />');
                $(postEle).append(post.PostContent);
                $(postEle).append('<br />');
            });
            $('body').removeClass('loading');
        });
    }
    
    function ajaxCall(data, async, url, type) {
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