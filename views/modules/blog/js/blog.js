'use strict';

/* global CKEDITOR $ Shelby */

$(function () {
    getAllPosts();
    
    $('#addPost_btn').click(function () {
        $('#ckeditor_addPost').ckeditor();
    });
    
    $('#addPost_cancelBtn').click(function () {
        var editor = $('#ckeditor_addPost').ckeditor().editor;
        setTimeout(function() {
            editor.destroy();
            $('#ckeditor_addPost').val('');
            $('#addPost_title').next().removeClass('glyphicon-remove').hide();
            $('#addPost_title').parent().removeClass('has-error');
            $('#addPost_title').val('');
        }, 500);
    });
    
    $('#addPost_submitBtn').click(function () {
        var title = $('#addPost_title').val();
        if (title !== '') {
            var data = {
                title: title,
                content: $('#ckeditor_addPost').val()
            };
            var ajax = Shelby.ajaxCall(data, true, '/blog/addPost', 'POST');
            ajax.done(function () {
                $('#blogArea').empty();
                getAllPosts();
                $('#addPost_cancelBtn').click();
            });
        } else {
            $('#addPost_title').next().addClass('glyphicon-remove').show();
            $('#addPost_title').parent().addClass('has-error');
        }
    });
    
    $('#editPost_cancelBtn').click(function () {
        var editor = $('#ckeditor_editPost').ckeditor().editor;
        setTimeout(function() {
            editor.destroy(true);
        }, 500);
    });
    
    $('#editPost_submitBtn').click(function () {
        var data = {
            postId: $('#editPost_title').data('PostID'),
            content: $('#ckeditor_editPost').val()
        };
        var ajax = Shelby.ajaxCall(data, true, '/blog/editPost', 'PUT');
        ajax.done(function () {
            $('#blogArea').empty();
            getAllPosts();
            $('#editPost_cancelBtn').click();
        });
    });
    
    $('#editPost_deleteBtn').click(function () {
        var data = {
            postId: $('#editPost_title').data('PostID')
        };
        var ajax = Shelby.ajaxCall(data, true, '/blog/deletePost', 'DELETE');
        ajax.done(function () {
            $('#blogArea').empty();
            getAllPosts();
            $('#editPost_cancelBtn').click();
        });
    });
    
    //do a GET to the module api and get all current blog posts
    function getAllPosts() {
        //add our loading screen while we do our ajax (thanks Shelby!)
        Shelby.loading();
        var ajax = Shelby.ajaxCall(null, true, '/blog/getPosts', 'GET');
        ajax.done(function (posts) {
            //sort the posts by their PostID (not date because PostID is a safe enough bet and avoids having to parse date everytime)
            posts = posts.sort(function (a, b) {
                return a.PostID < b.PostID;
            });
            //loop through posts, build the element, and append it to the DOM
            $.each(posts, function (i, post) {
                var postEle = $('<div class="col-sm-8 col-md-10 post">').appendTo('#blogArea');
                //we include an edit pencil in blog.ejs if the user is an admin. jQuery will fail silently if it doesn't find it.
                var editPencil = $('.blog-post-edit-pencil.template').clone();
                $(editPencil).click(function () {
                    editPost(post);
                }).removeClass('template').show();
                $(postEle).append(editPencil);
                var dateCreated = new Date(post.DateCreated);
                var date = dateCreated.getMonth() + 1 + '/' + dateCreated.getDate() + '/' + dateCreated.getFullYear();
                $(postEle).append('<h4>' + post.PostTitle + ' <small> - Posted by ' + post.CreatedBy + ' on ' + date +'</small></h4>');
                $(postEle).append('<hr />');
                $(postEle).append(post.PostContent);
                $(postEle).append('<br />');
            });
            //remove loading screen
            Shelby.doneLoading();
        });
    }
    
    function editPost(post) {
        $('#ckeditor_editPost').ckeditor();
        $('#editPost_title').html(post.PostTitle);
        $('#editPost_title').data('PostID', post.PostID);
        $('#ckeditor_editPost').val(post.PostContent);
        $.fancybox('#editPost', {
            closeBtn: false,
            helpers: {
                overlay: {
                    closeClick: false
                }
            }
        });
    }
});