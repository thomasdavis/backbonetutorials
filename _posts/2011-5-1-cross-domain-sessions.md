---
layout: post
title: Cross-domain Backbone.js with sessions using CORS
type: intermediate
posturl: http://backbonetutorials.com/cross-domain-sessions
---

# Cross-domain Backbone.js with sessions using CORS

** This tutorial is a proof of concept and needs to be checked for security flaws **

This tutorial will teach you how to completely separate the server and client allowing for developers to work with freedom in their respective areas.

On a personal note, I consider this development practice highly desirable and encourage others to think of the possible benefits but the security still needs to be proved.


> Cross-Origin Resource Sharing (CORS) is a specification that enables a truly open access across domain-boundaries. - [enable-cors.org](http://enable-cors.org/)

**Some benefits include**

* The client and back end exist independently regardless of where they are each hosted and built.
* Due to the separation of concerns, testing now becomes easier and more controlled.
* Develop only one API on the server, your front-end could be outsourced or built by a in-house team.
* As a front-end developer you can host the client anywhere.
* This separation enforces that the API be built robustly, documented, collaboratively and versioned.


** Cons of this tutorial **

* This tutorial doesn't explain how to perform this with cross browser support. CORS headers aren't supported by Opera and IE 6/7. Though it is do-able using [easyXDM](http://easyxdm.net/wp/)
* Security is somewhat addressed but maybe a more thorough security expert can chime in.

## Security

* Don't allow GET request to change data, only retrieve.
* Whitelist your allowed domains (see [server.js](https://github.com/thomasdavis/backbonetutorials/blob/gh-pages/examples/cross-domain/server.js))
* Protect again [JSON padding](http://blog.opensecurityresearch.com/2012/02/json-csrf-with-parameter-padding.html)

## Getting started

To easily understand this tutorial you should jump straight into the example code base.

Host the codebase on a simple HTTP server such that the domain is `localhost` with port 80 hidden.

[Example Codebase](https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/examples/cross-domain)

[Example Demo](http://backbonetutorials.com/examples/cross-domain/)


This tutorial focuses on building a flexible Session model to control session state in your application.

## Checking session state at first load

Before starting any routes, we should really know whether the user is authenticated. This will allow us to load the appropriate views. We will simply wrap our `Backbone.history.start` in a callback that executes after `Session.getAuth` has checked the server. We will jump into our Session model next.

{% highlight javascript %}
define([
  'jquery',
  'underscore',
  'backbone',
  'vm',
  'events',
  'models/session',
  'text!templates/layout.html' 
], function($, _, Backbone, Vm, Events, Session, layoutTemplate){
  var AppView = Backbone.View.extend({
    el: '.container',
    initialize: function () {
        $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
        // Your server goes below
        //options.url = 'http://localhost:8000' + options.url;
        options.url = 'http://cross-domain.nodejitsu.com' + options.url;
      });
    
    },
    render: function () {
      var that = this;
      $(this.el).html(layoutTemplate);
      // This is the entry point to your app, therefore
      // when the user refreshes the page we should
      // really know if they're authed. We will give it
      // A call back when we know what the auth status is
      Session.getAuth(function () {
        Backbone.history.start();
      })
    } 
	});
  return AppView;
});
{% endhighlight %}

_Note: We have used jQuery `ajaxPrefilter` to hook into all AJAX requests before they are executed. This is where we specify what server we want the application to hit._

## An example Session model

This is a very light weight Session model which handles most situations. Read through the code and comments below. The model simply has a login, logout and check function. Again we have hooked into jQuery `ajaxPrefilter` to allow for csrf tokens and also telling jQuery to send cookies with the `withCredentials` property. The model relies heavily on it's `auth` property. Throughout your application, each view can simply bind to `change:auth` on the Session model and react accordingly. Because we return this AMD module instantiated using the new keyword, then it will keep state throughout the page. (This may not be best practice but it's highly convenient)

{% highlight javascript %}
// views/app.js
define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var SessionModel = Backbone.Model.extend({
  
    urlRoot: '/session',
    initialize: function () {
      var that = this;
      // Hook into jquery
      // Use withCredentials to send the server cookies
      // The server must allow this through response headers
      $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
        options.xhrFields = {
          withCredentials: true
        };
        // If we have a csrf token send it through with the next request
        if(typeof that.get('_csrf') !== 'undefined') {
          jqXHR.setRequestHeader('X-CSRF-Token', that.get('_csrf'));
        }
      });
    },
    login: function(creds) {
      // Do a POST to /session and send the serialized form creds
      this.save(creds, {
         success: function () {}
      });
    },
    logout: function() {
      // Do a DELETE to /session and clear the clientside data
      var that = this;
      this.destroy({
        success: function (model, resp) {
          model.clear()
          model.id = null;
          // Set auth to false to trigger a change:auth event
          // The server also returns a new csrf token so that
          // the user can relogin without refreshing the page
          that.set({auth: false, _csrf: resp._csrf});
          
        }
      });      
    },
    getAuth: function(callback) {
      // getAuth is wrapped around our router
      // before we start any routers let us see if the user is valid
      this.fetch({
          success: callback
      });
    }
  });
  return new SessionModel();

});
{% endhighlight %}

_Note: This session model is missing one useful feature. If a user looses auth when navigating your application then the application should set {auth: false} on this model. To do this, in the `ajaxPrefilter` edit outgoing `success` functions to check if the server response was {auth: false} and then call the original `success()` function._

## Hooking up views to listen to changes in `auth`

Now that we have a Session model, let's hook up our `login/logout` view to listen to changes in `auth`. When creating the view we use `on` to bind a listener to the `auth` attribute of our model. Everytime it changes we will re-render the view which will conditionally load a template depending on the value of `Session.get('auth')`.

{% highlight javascript %}
// models/session.js
define([
  'jquery',
  'underscore',
  'backbone',
  'models/session',
  'text!templates/example/login.html',
  'text!templates/example/logout.html'
], function($, _, Backbone, Session, exampleLoginTemplate, exampleLogoutTemplate){
  var ExamplePage = Backbone.View.extend({
    el: '.page',
    initialize: function () {
      var that = this;
      // Bind to the Session auth attribute so we
      // make our view act recordingly when auth changes
      Session.on('change:auth', function (session) {
          that.render();
      });
    },
    render: function () {
      // Simply choose which template to choose depending on
      // our Session models auth attribute
      if(Session.get('auth')){
        this.$el.html(_.template(exampleLogoutTemplate, {username: Session.get('username')}));
      } else {
        this.$el.html(exampleLoginTemplate); 
      }
    },
    events: {
      'submit form.login': 'login', // On form submission
      'click .logout': 'logout'
    },
    login: function (ev) {
      // Disable the button
      $('[type=submit]', ev.currentTarget).val('Logging in').attr('disabled', 'disabled');
      // Serialize the form into an object using a jQuery plgin
      var creds = $(ev.currentTarget).serializeObject();
      Session.login(creds);
      return false;
    },
    logout: function (ev) {
      // Disable the button
      $(ev.currentTarget).text('Logging out').attr('disabled', 'disabled');
      Session.logout();
    }
  });
  return ExamplePage;
});
{% endhighlight %}

_Note: `.serializeObject` is not a native jQuery function and I have included it as [app.js](https://github.com/thomasdavis/backbonetutorials/blob/gh-pages/examples/cross-domain/js/views/app.js) in the demo folder. `creds` can be an object of any variation of inputs, regardless it will be converted to JSON and posted to the server like any normal Backbone model._

Here are the templates we are using for our login view

{% highlight javascript %}
<!-- templates/example/login.html -->
<form class="login">
    <label for="">Username</label>
    <input name="username" type="text" required autofocus>
    <input type="submit" id="submit" value="Login">
</form>

<!-- templates/example/logout.html -->
<p>Hello, <%= username %>. Time to logout?</p>
<button class="logout">Logout</button>

{% endhighlight %}

This wraps up setting up the client, there are some notable points to make sure this technique works.

* You must use `withCredentials` supplied by jQuery - session.js
* You must send your request with csrf tokens for security - session.js
* You should wrap your applications entry pointer (router in this example) in a check auth function - app.js
* You must point your application at the right server - app.js

## Building a compatible server

This tutorial uses node.js, express.js and a modified csrf.js library. An example server.js file exist in the `examples/cross-domain` folder. When inside the folder simply type `npm install -d` to install the dependencies and then `node server.js` to start the server. Again, make sure your `app.js` points at the correct server.

The server has to do a few things;

* Allow CORS request
* Implement csrf protection
* Allow jQuery to send credentials
* Set a whitelist of allowed domains
* Configure the correct response headers

To save you sometime here are some gotchas;

* When sending `withCredentials` you must set correct response header `Access-Control-Allow-Credentials: true`. Also as a security policy browsers do not allow `Access-Control-Allow-Origin` to be set to `*`. So the origin of the request has to be known and trusted, so in the example below we use an of white listed domains.
* jQuery ajax will trigger the browser to send these headers to enforce security `origin, x-requested-with, accept` so our server must allow them.
* The browser might send out a `pre-flight` request to verify that it can talk to the server. The server must return `200 OK` on these  `pre-flight` request.

Be sure to read this Mozilla [documentation](http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/) on the above.

## Example node server

This server below implements everything we have talked about so far. It should be relatively easy to see how would translate into other frameworks and languages. `app.configure` runs the specified libraries against every request. We have told the server that on each request it should check the csrf token and check if the origin domain is white-listed. If so we edit each request to contain the appropriate headers.

This server has 3 endpoints, that are pseudo-restful;

* POST /session - Login - Sets the session username and returns a csrf token for the user to use
* DELETE /session - Logout - Destroys the session and regenerates a new csrf token if the user wants to re-login
* GET /session - Checks Auth - Simply returns if auth is true or false, if true then also returns some session details

{% highlight javascript %}
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
{% endhighlight %}

_Note: I wrote a custom csrf module for this which can be found in the example directory. It's based of connects and uses the `crypto` library.   I didn't spend much time on it but other traditional csrf modules won't work because they aren't exactly built for this implementation technique._


## Conclusion

This approach really hammers in the need for a well documented and designed API. A powerful API will let you do application iterations with ease.

Again, it would be great for some more analysis of the security model.

Enjoy using Backbone.js cross domain!

_I cannot get passed the spam filter on HackerNews so feel free to submit this tutorial_

[Example Codebase](https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/examples/cross-domain)

[Example Demo](http://backbonetutorials.com/examples/cross-domain/)

### Relevant Links

* [cross-site xmlhttprequest with CORS](http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/)
* [Cross-Origin Resource Sharing](http://www.w3.org/TR/cors/)
* [Using CORS with All (Modern) Browsers](http://www.kendoui.com/blogs/teamblog/posts/11-10-04/using_cors_with_all_modern_browsers.aspx)
