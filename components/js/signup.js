'use strict';

/* global $ */

$(function () {
    $('#signupForm_submitBtn').click(function () {
        if ($('.has-success').length === $('#signupForm .form-group').length) {
            $('#signupForm form').submit();
        }
    });
    
    $('#signupForm_username').blur(function () {
        if ($(this).val() !== '') {
            var data = {
                username: $(this).val()
            };
            var apiCall = callAPI(data, true, '/shelby/checkUsername');
            apiCall.done(function (res) {
                if (res) {
                    setBootstrapClasses('signupForm_username', 'success');
                } else {
                    setBootstrapClasses('signupForm_username', 'error');
                }
            });
        } else {
            setBootstrapClasses('signupForm_username', 'error');
        }
    });
    
    $('#signupForm_email').blur(function () {
        var emailCheck = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
        var isValid = emailCheck.test($(this).val());
        if (isValid) {
            setBootstrapClasses('signupForm_email', 'success');
        } else {
            setBootstrapClasses('signupForm_email', 'error');
        }
    });
    
    $('#signupForm_password').blur(function () {
        if ($(this).val() !== '') {
            setBootstrapClasses('signupForm_password', 'success');
        } else {
            setBootstrapClasses('signupForm_password', 'error');
        }
    });
    
    $('#signupForm_confirmPassword').blur(function () {
        if ($(this).val() !== '' && $(this).val() === $('#signupForm_password').val()) {
            setBootstrapClasses('signupForm_confirmPassword', 'success');
        } else {
            setBootstrapClasses('signupForm_confirmPassword', 'error');
        }
    });
    
    $('#signupForm_cancelBtn').click(function () {
        $('#signupForm_confirmPassword').parent().removeClass('has-error has-feedback').removeClass('has-success has-feedback');
        $('#signupForm_confirmPassword').next().removeClass('glyphicon-remove glyphicon-ok');
        $('#signupForm_password').parent().removeClass('has-error has-feedback').removeClass('has-success has-feedback');
        $('#signupForm_password').next().removeClass('glyphicon-remove glyphicon-ok');
        $('#signupForm_email').parent().removeClass('has-error has-feedback').removeClass('has-success has-feedback');
        $('#signupForm_email').next().removeClass('glyphicon-remove glyphicon-ok');
        $('#signupForm_username').parent().removeClass('has-error has-feedback').removeClass('has-success has-feedback');
        $('#signupForm_username').next().removeClass('glyphicon-remove glyphicon-ok');
    });
    
    function setBootstrapClasses(selector, type) {
        if (type === 'success') {
            $('#' + selector).parent().removeClass('has-error has-feedback').addClass('has-success has-feedback');
            $('#' + selector).next().removeClass('glyphicon-remove').addClass('glyphicon-ok').show();
        } else {
            $('#' + selector).parent().removeClass('has-success has-feedback').addClass('has-error has-feedback');
            $('#' + selector).next().removeClass('glyphicon-ok').addClass('glyphicon-remove').show();
        }
    }
    
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