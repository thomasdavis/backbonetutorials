
var express = require('express');
var app = express.createServer();

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  next();
}

app.configure(function() {
    app.use(express.cookieParser({cookie: { domain : "localhost" }}));
    app.use(express.session({ secret: 'thomasdavislovessalmon' }));
    app.use(express.bodyParser());
    app.use(allowCrossDomain);
});

app.get('/session', function(req, res){ 
  // Check auth
  if(typeof req.session.username !== 'undefined'){
    res.send({auth: true, id: req.session.id, username: req.session.username});
  } else {
    res.send({auth: false});
  }
});

app.post('/session', function(req, res){  
  // Login
  // Here you would pull down your user credentials and match them up
  // to the request
  var randomSessionId = Math.ceil(Math.random() * 100000);
  req.session.id = randomSessionId;
  req.session.username = req.body.username;
  res.send({auth: true, id: req.session.id, username: req.session.username});
});

app.del('/session/:id', function(req, res, next){  
  // Logout
  req.session.destroy(function(err){
    res.send({auth: false});  
  });  
});

app.listen(8000);
