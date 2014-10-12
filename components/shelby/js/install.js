'use strict';

/* global $ */

$(function () {
    $('#signupForm_submitBtn').click(function () {
        if ($('.has-success').length === $('#signupForm .form-group.has-feedback').length) {
            $('#signupForm form').submit();
        }
    });
    
    $('#installForm_email').blur(function () {
        var emailCheck = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
        var isValid = emailCheck.test($(this).val());
        if (isValid) {
            setBootstrapClasses('installForm_email', 'success');
        } else {
            setBootstrapClasses('installForm_email', 'error');
        }
    });
    
    $('#installForm_password').blur(function () {
        if ($(this).val() !== '') {
            setBootstrapClasses('installForm_password', 'success');
        } else {
            setBootstrapClasses('installForm_password', 'error');
        }
    });
    
    $('#installForm_confirmPassword').blur(function () {
        if ($(this).val() !== '' && $(this).val() === $('#installForm_password').val()) {
            setBootstrapClasses('installForm_confirmPassword', 'success');
        } else {
            setBootstrapClasses('installForm_confirmPassword', 'error');
        }
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
});