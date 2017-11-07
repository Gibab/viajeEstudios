'use strict';
var path =require('path');

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
};
