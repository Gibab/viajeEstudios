'use strict';

var dsConfig = require('../datasources.local.js');
var path = require('path');

module.exports = function(app) {
  // Install a `/` route that returns app login
  var router = app.loopback.Router();

  //login page
  app.get('/', function(req, res) {
    var credentials = dsConfig.myEmailDataSource.transports[0].auth;
    res.render('login', {
      email: credentials.user,
      password: credentials.pass
    });
  });

  //verified
  app.get('/verified', function(req, res) {
    res.render('verified');
  });
  app.use(router);

};
