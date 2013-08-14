# Simple example - Node.js, Restify, MongoDb and Mongoose

authors: Thomas Davis | https://github.com/thomasdavis
 		 Brandon Flowers | https://github.com/headwinds 

If you would like to discuss any of this code, please your leave comments using disqus at the bottom of this article:

http://backbonetutorials.com/nodejs-restify-mongodb-mongoose/ 

## STRUCTURE

There are basically two parts to this demo - two servers - within one file, server.js, which may sound a little confusing but the two servers do different things. 

The first server, httpServer, serves up static html/js/css to the browser and the second, mongodbServer, is purely for saving and retrieving data from the mongodb.  

I've put both servers in the server.js which makes it extremely long and challenging to maintain but it does the job for this demo. Also, each server is listening on its own port. If you are only allowed access to one public port, you could choose one server to listen on that port then pass the events to the other server which may be interested in different routes. For instance, in this case, if the http server listens for a /messages route, it could trigger an event and pass that to the mongo server. 

In addition to server.js, I've also refactored it into two separate files: server-http.js and server-mongo.js.

If you only need the mongobd server, you might start with the server-mongo folder.  

## HTTP SERVER

Originally, this tutorial started out as purely a mongodb one but I wanted to see the data in a browser and since this is a collection of Backbone tutorials, I might as well include some client-side backbone views. I aslo started working on it before discovering Google's Yeoman which includes its own web server that serves static files thus making the HTTP portion not necessary when testing locally, however, when you move to host these files somewhere else like nodejitsu, you may need to use your own static web server if it doesn't support nginx or apache. 

But before using Yeoman, you might want to try open a terminal to the directory of this app and typing:

$ node server   

Next, you will need to open browser and point it to:

http://localhost:8080/

Alternatively, you can use Yeoman which would automatically launch a browswer window and also you more features like live reload. 

$ yeoman server

By default, yeoman looks at the "app" directory. If you update to Yeoman 1.0, you are able to configure this path in the grunt.js file and configure it to look any folder like "public" but at the time of writing this demo, I'm using Yeoman 0.9.6 so will keep the "app" directory.
 
Yeoman automatically launches a browser window to: 

http://localhost:3501/ 

http server: 


If you'd like to see the raw messages as a json dump, you can point your browser to: 

http://localhost:8888/messages 

This static server is taken very largely (line for line) from this example: 
http://thecodinghumanist.com/blog/archives/2011/5/6/serving-static-files-from-node-js

## MONGODB

In order to setup my mongodb database, I've taken the following steps:

1. I have two terminal windows open.

2. In the the first one, I've started mongoDB: 
$ mongod

3. In the second, I've started the mongo shell
$ mongo

In the mongo shell, I've created a database called "nationalpark"

> use nationalpark 

This will automatically create and use this new database called nationalpark 

then, I've added a collection called "messages" and inserted a message

var message = { message: "onward, upward", hiker: "rosella"}; 

> db.messages.insert(message); 

Once you use nationalpark, db becomes the link to it

Just to prove you've added a message, you can display all the messages 

> db.messages.find();

Now, I have a database with a collection of messages containing at least one message. You view this message in the browser, visit:

http://localhost:8888/messages

## CONFIG

If you plan to work with a public github, it is a good idea to protect your production mongodb connection uri 
and put it in a config file which you include in .gitignore so that it doesn't get committed  

var config = require('./config'); // Local congig file to hide creds
db = mongoose.connect(config.mongoose_auth),
Schema = mongoose.Schema;  

When you go to host it on a platform like nodejitsu, you will need to deploy that config file so ensure it is included by using a .npmignore file

Within my .gitignore file, I have three line to not include my config.js and my sublime project files: 

config.js 
backbone.sublime-project
backbone.sublime-workspace 

Within my .npmignore file, I have one to include the config:

!./config.js



