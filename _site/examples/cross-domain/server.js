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
    'http://localhost',
    'http://fiddle.jshell.net'
  ];

  if(allowedHost.indexOf(req.headers.origin) !== -1) {
    res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    if(req.headers['user-agent'] === 'Amazon CloudFront') {
      res.header('Expires', new Date(new Date().getTime() + 30000).toUTCString());
      res.header('Access-Control-Allow-Origin', '*');

    } else {
     res.header('Access-Control-Allow-Origin', req.headers.origin)
    }
    next();
  } else {
   res.header('Expires', '0');
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

app.get('/test1', function(req, res){ 

    res.send({test1: false});

});
app.get('/test2', function(req, res){ 

    res.send({test2: false});

});
app.get('/test31', function(req, res){ 

    res.send({test3: false});

});
app.listen(2000);
