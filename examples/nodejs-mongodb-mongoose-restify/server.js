
//http server
var fs = require('fs');
var httpServer = require('http');
var path = require('path');
var connect = require('connect');
//mongo server
var mongoose = require('mongoose/');
var restify = require('restify');  

var config = require('./config');

// localhost

var httpPort = process.env.PORT || 8080;
var mongodbPort = 8888;

/* 
 
 see README.md for a more detailed write up 

*/

//////////////////////////////////////////////////////// HTTP - sends html/js/css to the browswer 

var sendHTML = function( filePath, contentType, response ){

  console.log('sendHTML: ' + filePath) ;

  path.exists(filePath, function( exists ) {
     
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });
}

var getFilePath = function(url) {

  var filePath = './public' + url;
  if (url == '/' ) filePath = './public/index.html';

  console.log("url: " + url)

  return filePath;
}

var getContentType = function(filePath) {
   
   var extname = path.extname(filePath);
   var contentType = 'text/html';
    
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }

    return contentType;
}

var onHtmlRequestHandler = function(request, response) {

  console.log('onHtmlRequestHandler... request.url: ' + request.url) ;

  /*
   when this is live, nodjitsu only listens on 1 port(80) so the httpServer will hear it first but
   we need to pass the request to the mongodbServer
   */
  if ( process.env.PORT && url === '/messages') {
    
    // pass the request to mongodbServer
   

    return; 
  } 

  var filePath = getFilePath(request.url);
  var contentType = getContentType(filePath);

  console.log('onHtmlRequestHandler... getting: ' + filePath) ;

  sendHTML(filePath, contentType, response); 

}

httpServer.createServer(onHtmlRequestHandler).listen(httpPort); 

////////////////////////////////////////////////////// MONGODB - saves data in the database and posts data to the browser

var mongoURI = ( process.env.PORT ) ? config.creds.mongoose_auth_jitsu : config.creds.mongoose_auth_local;

db = mongoose.connect(mongoURI),
Schema = mongoose.Schema;  

var mongodbServer = restify.createServer({
    formatters: {
        'application/json': function(req, res, body){
            if(req.params.callback){
                var callbackFunctionName = req.params.callback.replace(/[^A-Za-z0-9_\.]/g, '');
                return callbackFunctionName + "(" + JSON.stringify(body) + ");";
            } else {
                return JSON.stringify(body);
            }
        },
        'text/html': function(req, res, body){
            return body;
        }
    }
});

mongodbServer.use(restify.bodyParser());

// Create a schema for our data
var MessageSchema = new Schema({
  message: String,
  date: Date
});

// Use the schema to register a model
mongoose.model('Message', MessageSchema); 
var Message = mongoose.model('Message'); 


// This function is responsible for returning all entries for the Message model
var getMessages = function(req, res, next) {
  // Resitify currently has a bug which doesn't allow you to set default headers
  // This headers comply with CORS and allow us to mongodbServer our response to any origin
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  
  console.log("mongodbServer getMessages");

  Message.find().limit(20).sort('date', -1).execFind(function (arr,data) {
    res.send(data);
  });
}

var postMessage = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  // Create a new message model, fill it up and save it to Mongodb
  var message = new Message(); 
  
  console.log("mongodbServer postMessage: " + req.params.message);

  message.message = req.params.message;
  message.date = new Date() 
  message.save(function () {
    res.send(req.body);
  });
}

mongodbServer.listen(mongodbPort, function() {
  
  var consoleMessage = '\n A Simple MongoDb, Mongoose, Restify, and Backbone Tutorial'
  consoleMessage += '\n +++++++++++++++++++++++++++++++++++++++++++++++++++++' 
  consoleMessage += '\n\n %s says your mongodbServer is listening at %s';
  consoleMessage += '\n great! now open your browser to http://localhost:3501';
  consoleMessage += '\n where you will connect to your httpServer that will';
  consoleMessage += '\n talk to your mongodbServer to get and post your messages. \n\n';
  consoleMessage += '+++++++++++++++++++++++++++++++++++++++++++++++++++++ \n\n'  
 
  console.log(consoleMessage, mongodbServer.name, mongodbServer.url);

});

mongodbServer.get('/messages', getMessages);
mongodbServer.post('/messages', postMessage);

