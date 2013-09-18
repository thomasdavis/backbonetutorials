---
layout: post
title: Simple example - Node.js, Restify, MongoDb and Mongoose 
type: intermediate
posturl: http://backbonetutorials.com/nodejs-restify-mongodb-mongoose
---

# Simple example - Node.js, Restify, MongoDb and Mongoose 

Before I start, the Backbone.js parts of this tutorial will be using techniques described in "Organizing your application using [Modules](http://backbonetutorials.com/organizing-backbone-using-modules/) to construct a simple guestbook.

## Getting started

To easily understand this tutorial you should jump straight into the example code base.

[Example Codebase](https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/examples/nodejs-mongodb-mongoose-restify)

[Example Demo](http://backbonetutorials.com/examples/nodejs-mongodb-mongoose-restify/app)

This tutorial will assist you in saving data(Backbone.js Models) to MongoDb and retrieving a list(Backbone.js Collections) of them back.

## The technologies

This stack is great for rapid prototyping and highly intuitive. Personal note: I love using JavaScript as my only language for the entire application (FrontEnd/BackEnd/API/Database). Restify is still in early development but is essentially just an extension of Express. So for anyone needing more stability you can easily just substitute Express in.

### Node.js

"Node.js is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices."


### Restify

"Restify is a node.js module built specifically to enable you to build correct REST web services. It borrows heavily from express (intentionally) as that is more or less the de facto API for writing web applications on top of node.js."

### MongoDb

"MongoDB (from "humongous") is a scalable, high-performance, open source NoSQL database."

### Mongoose

"Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment."

## Building the server

In the example repository there is a server.js example which can be executed by running `node server.js`. If you use this example in your own applications make sure to update the Backbone.js [Model](https://github.com/thomasdavis/backbonetutorials/blob/gh-pages/examples/nodejs-mongodb-mongoose-restify/js/models/message.js) and [Collection](https://github.com/thomasdavis/backbonetutorials/blob/gh-pages/examples/nodejs-mongodb-mongoose-restify/js/collections/messages.js) definitions to match your server address.

## Restify configuration

The first thing to do is require the Restify module. Restify will be in control of handling our restful endpoints and returning the appropriate JSON.

{% highlight javascript %}
var restify = require('restify');  
var server = restify.createServer();
server.use(restify.bodyParser());
{% endhighlight %}

Note: bodyParser() takes care of turning your request data into a JavaScript object on the server automatically.

## MongoDb/Mongoose configuration


We simply want to require the MongoDb module and pass it a MongoDb authentication URI  e.g. mongodb://username:server@mongoserver:10059/somecollection

The code below presupposes you have another file in the same directory called `config.js`. Your config should never be public as it contains your credentials. So for this repository I have added `config.js` to my `.gitignore` but added in a [sample config](https://github.com/thomasdavis/backbonetutorials/blob/gh-pages/examples/nodejs-mongodb-mongoose-restify/config-sample.js).

{% highlight javascript %}
var mongoose = require('mongoose/');
var config = require('./config');
db = mongoose.connect(config.creds.mongoose_auth),
Schema = mongoose.Schema;  
{% endhighlight %}

## Mongoose Schema

Mongoose introduces a concept of [model/schema](http://mongoosejs.com/docs/model-definition.html) enforcing types which allow for easier input validation etc

{% highlight javascript %}
// Create a schema for our data
var MessageSchema = new Schema({
  message: String,
  date: Date
});
// Use the schema to register a model with MongoDb
mongoose.model('Message', MessageSchema); 
var Message = mongoose.model('Message'); 
{% endhighlight %}

_Note: `Message` can now be used for all things CRUD related._

## Setting up the routes

Just like in Backbone, Restify allows you to configure different routes and their associated callbacks. In the code below we define two routes.  One for saving new messages and one for retrieving all messages. After we have created our function definitions, we attach them to either GET/POST/PUT/DELETE on a particular restful endpoint e.g. GET /messages

{% highlight javascript %}
// This function is responsible for returning all entries for the Message model
function getMessages(req, res, next) {
  // Resitify currently has a bug which doesn't allow you to set default headers
  // This headers comply with CORS and allow us to server our response to any origin
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  // .find() without any arguments, will return all results
  // the `-1` in .sort() means descending order
  Message.find().sort('date', -1).execFind(function (arr,data) {
    res.send(data);
  });
}



function postMessage(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  // Create a new message model, fill it up and save it to Mongodb
  var message = new Message();
  message.message = req.params.message;
  message.date = new Date();
  message.save(function () {
    res.send(req.body);
  });
}

// Set up our routes and start the server
server.get('/messages', getMessages);
server.post('/messages', postMessage);

{% endhighlight %}

This wraps up the server side of things, if you follow the [example](https://github.com/thomasdavis/backbonetutorials/blob/gh-pages/examples/nodejs-mongodb-mongoose-restify/server.js) then you should see something like

[http://backbonetutorials.nodejitsu.com/messages](http://backbonetutorials.nodejitsu.com/messages)


_Note: Again you must remember to change the [Model](https://github.com/thomasdavis/backbonetutorials/blob/gh-pages/examples/nodejs-mongodb-mongoose-restify/js/models/message.js) and [Collection](https://github.com/thomasdavis/backbonetutorials/blob/gh-pages/examples/nodejs-mongodb-mongoose-restify/js/collections/messages.js) definitions to match your server address._

## Setting up the client (Backbone.js)

I've actually used the latest copy of [http://backboneboilerplate.com](http://backboneboilerplate.com) to set up the example page.

The important files you will want to check out are;

* views/dashboard/page.js
* views/guestbook/form.js
* views/guestbook/list.js
* models/message.js
* collections/messages.js
* templates/guestbook/

## Saving a message

First of all we want to setup a [template](https://github.com/thomasdavis/backbonetutorials/blob/gh-pages/examples/nodejs-mongodb-mongoose-restify/templates/guestbook/form.html) for showing our form that creates new messages.

{% highlight javascript %}
<textarea class="message"></textarea>
<button class="post-message">Post Message</button>
{% endhighlight %}

This template gets inserted into the DOM by `views/guestbook/form.js`, this Backbone view also handles the interaction of the form and the posting of the new data.

Let us create a Backbone Model that has the correct URL for our restful interface.

{% highlight javascript %}
define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var Message = Backbone.Model.extend({
      url: 'http://localhost:8080/messages'
  });
  return Message;
});

{% endhighlight %}


We can see how we require our predefined model for messages and also our form template.

{% highlight javascript %}
define([
  'jquery',
  'underscore',
  'backbone',
  'models/message',
  'text!templates/guestbook/form.html'
], function($, _, Backbone, MessageModel, guestbookFormTemplate){
  var GuestbookForm = Backbone.View.extend({
    el: '.guestbook-form-container',
    render: function () {
      $(this.el).html(guestbookFormTemplate);
      
    },
    events: {
      'click .post-message': 'postMessage'
    },
    postMessage: function() {
      var that = this;

      var message = new MessageModel();
      message.save({ message: $('.message').val()}, {
        success: function () {
          that.trigger('postMessage');
        }
      });
    }
  });
  return GuestbookForm;
});
{% endhighlight %}

_Note: `trigger` is from Backbone Events, I binded a listener to this view in `views/dashboard/page.js` so when a new message is submitted, the list is re-rendered. We are setting the date of the POST on the server so there is no need to pass it up._

## Retrieving a list of messages

We setup a route on our server to generate a list of all available messages at `GET /messages`. So we need to define a collection with the appropriate `url` to fetch this data down.

{% highlight javascript %}
define([
  'jquery',
  'underscore',
  'backbone',
  'models/message'
], function($, _, Backbone, MessageModel){
  var Messages = Backbone.Collection.extend({
    model: MessageModel, // Generally best practise to bring down a Model/Schema for your collection
    url: 'http://localhost:8080/messages'
  });

  return Messages;
});
{% endhighlight %}

Now that we have a collection to use we can setup our `views/list.js` to require the collection and trigger a fetch. Once the fetch is complete we want to render our returned data to a template and insert it into the DOM.

{% highlight javascript %}
define([
  'jquery',
  'underscore',
  'backbone',
  'collections/messages',
  'text!templates/guestbook/list.html'
], function($, _, Backbone, MessagesCollection, guestbookListTemplate){
  var GuestbookList = Backbone.View.extend({
    el: '.guestbook-list-container',
    render: function () {
      var that = this;
      var messages = new MessagesCollection();
      messages.fetch({
        success: function(messages) {
          $(that.el).html(_.template(guestbookListTemplate, {messages: messages.models, _:_}));
        }
      });
    }
  });
  return GuestbookList;
});
{% endhighlight %}

The template file should iterate over `messages.models` which is an array and print out a HTML fragment for each model.

{% highlight javascript %}
<% _.each(messages, function(message) { %>

<p><%= message.get('message') %></p>
<em><%= message.get('date') %></em>

<% }); %>

{% endhighlight %}

This actually sums up everything you need to know to implement this simple example.

## Conclusion

[Example Codebase](https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/examples/nodejs-mongodb-mongoose-restify)

[Example Demo](http://backbonetutorials.com/examples/nodejs-mongodb-mongoose-restify/app)

In this example you should really be using relative URL's in your collections/models and instead setting a baseUrl in a config file or by placing your index.html file on the restful server.

This example is hosted on GitHub therefore we had to include the absolute URL to the server which is hosted on nodejitsu.com

On a personal note, I have of recent used the Joyent, Nodejitsu, MongoDbHq stack after they have now partnered up and I have nothing but good things to say. Highly recommend you check it out!

As always I hope I made this tutorial easy to follow!

Get in touch with me on twitter, comments or GitHub!

### Relevant Links

[Organizing Your Backbone.js Application With Modules](http://weblog.bocoup.com/organizing-your-backbone-js-application-with-modules)
