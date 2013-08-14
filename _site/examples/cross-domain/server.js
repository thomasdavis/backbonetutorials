var express = require('express');

var connect = require('connect');
// Custom csrf library
var csrf = require('./csrf');

var app = express.createServer();

var allowCrossDomain = function(req, res, next) {
  // Added other domains you want the server to give access to
  // WARNING - Be careful with what origins you give access to
  var allowedHost = [
    'http://backbonetutorials.com',
    'http://localhost'
  ];

  if(allowedHost.indexOf(req.headers.origin) !== -1) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    next();
  } else {
    res.send({auth: false});
  }
}

app.configure(function() {
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'thomasdavislovessalmon' }));
    app.use(express.bodyParser());
    app.use(allowCrossDomain);
    app.use(csrf.check);
});

app.get('/session', function(req, res){
  // This checks the current users auth
  // It runs before Backbones router is started
  // we should return a csrf token for Backbone to use
  if(typeof req.session.username !== 'undefined'){
    res.send({auth: true, id: req.session.id, username: req.session.username, _csrf: req.session._csrf});
  } else {
    res.send({auth: false, _csrf: req.session._csrf});
  }
});

app.post('/session', function(req, res){
  // Login
  // Here you would pull down your user credentials and match them up
  // to the request
  req.session.username = req.body.username;
  res.send({auth: true, id: req.session.id, username: req.session.username});
});

app.del('/session/:id', function(req, res, next){
  // Logout by clearing the session
  req.session.regenerate(function(err){
    // Generate a new csrf token so the user can login again
    // This is pretty hacky, connect.csrf isn't built for rest
    // I will probably release a restful csrf module
    csrf.generate(req, res, function () {
      res.send({auth: false, _csrf: req.session._csrf});
    });
  });
});

app.listen(8000);