'use strict';
var path = require('path');
var config = require('../../server/config.json');

module.exports = function (Usuario) {
    //send verification email after registration
    Usuario.afterRemote('create', function (context, usuarios, next) {
        var options = {
            type: 'email',
            to: usuarios.email,
            from: process.env.EMAIL_USER,
            subject: 'Thanks for registering.',
            template: path.resolve(__dirname, '../../server/views/verify.ejs'),
            redirect: '/verified',
            usuarios: usuarios
        };

        usuarios.verify(options, function (err, response) {
            if (err) {
                Usuario.deleteById(usuarios.id);
                return next(err);
            }
            context.res.render('response', {
                title: 'Signed up successfully',
                content: 'Please check your email and click on the verification link ' +
                'before logging in.',
                redirectTo: '/',
                redirectToLinkText: 'Log in'
            });
        });
    });

    // Method to render
    Usuario.afterRemote('prototype.verify', function (context, usuarios, next) {
        context.res.render('response', {
            title: 'A Link to reverify your identity has been sent ' +
            'to your email successfully',
            content: 'Please check your email and click on the verification link ' +
            'before logging in',
            redirectTo: '/',
            redirectToLinkText: 'Log in'
        });
    });
    //send password reset link when requested
    Usuario.on('resetPasswordRequest', function (usuarios) {
        var url = 'http://' + config.host + ':' + config.port + '/reset-password';
        var html = 'Click <a href="' + url + '?access_token=' +
            usuarios.accessToken.id + '">here</a> to reset your password';

        Usuario.app.models.Email.send({
            to: usuarios.email,
            from: process.env.EMAIL_USER,
            subject: 'Password reset',
            html: html
        }, function (err) {
            if (err) return console.log('> error sending password reset email');
            console.log('> sending password reset email to:', usuarios.email);
        });
    });

    //render UI page after password change
    Usuario.afterRemote('changePassword', function (context, usuarios, next) {
        context.res.render('response', {
            title: 'Password changed successfully',
            content: 'Please login again with new password',
            redirectTo: '/',
            redirectToLinkText: 'Log in'
        });
    });

    //render UI page after password reset
    Usuario.afterRemote('setPassword', function (context, usuarios, next) {
        context.res.render('response', {
            title: 'Password reset success',
            content: 'Your password has been reset successfully',
            redirectTo: '/',
            redirectToLinkText: 'Log in'
        });
    });
};
