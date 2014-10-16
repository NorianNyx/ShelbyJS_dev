'use strict';

/* global $ */

$(function () {
    $('#changePassword_newPassword').blur(function () {
        if ($(this).val() !== '') {
            setBootstrapClasses('changePassword_newPassword', 'success');
        } else {
            setBootstrapClasses('changePassword_newPassword', 'error');
        }
    });
    
    $('#changePassword_confirmNewPassword').blur(function () {
        if ($(this).val() !== '' && $(this).val() === $('#changePassword_newPassword').val()) {
            setBootstrapClasses('changePassword_confirmNewPassword', 'success');
        } else {
            setBootstrapClasses('changePassword_confirmNewPassword', 'error');
        }
    });
    
    $('#changePassword_cancelBtn').click(function () {
        $('#changePassword_confirmNewPassword').parent().removeClass('has-error has-feedback').removeClass('has-success has-feedback');
        $('#changePassword_confirmNewPassword').next().removeClass('glyphicon-remove glyphicon-ok');
        $('#changePassword_newPassword').parent().removeClass('has-error has-feedback').removeClass('has-success has-feedback');
        $('#changePassword_newPassword').next().removeClass('glyphicon-remove glyphicon-ok');
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