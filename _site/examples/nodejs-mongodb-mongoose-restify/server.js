// Setup mongoose and the database
// Check out ./config-sample to configure your MongoDb, rename it to config.js
var mongoose = require('mongoose/');
var config = require('./config'); // Local congig file to hide creds
db = mongoose.connect(config.creds.mongoose_auth),
Schema = mongoose.Schema;  

// require restify and bodyParser to read Backbone.js syncs
var restify = require('restify');  
var server = restify.createServer();
server.use(restify.bodyParser());


// Example Application

// Create a schema for our data
var MessageSchema = new Schema({
  message: String,
  date: Date
});
// Use the schema to register a model
mongoose.model('Message', MessageSchema); 
var Message = mongoose.model('Message'); 


// This function is responsible for returning all entries for the Message model
function getMessages(req, res, next) {
  // Resitify currently has a bug which doesn't allow you to set default headers
  // This headers comply with CORS and allow us to server our response to any origin
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  Message.find().limit(20).sort('date', -1).execFind(function (arr,data) {
    res.send(data);
  });
}



function postMessage(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  // Create a new message model, fill it up and save it to Mongodb
  var message = new Message(); 
  message.message = req.params.message;
  message.date = new Date() 
  message.save(function () {
    res.send(req.body);
  });
}

// Set up our routes and start the server
server.get('/messages', getMessages);
server.post('/messages', postMessage);

server.listen(8080, function() {
  console.log('%s listening at %s, love & peace', server.name, server.url);
});
