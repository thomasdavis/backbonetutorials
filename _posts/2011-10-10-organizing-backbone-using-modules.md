---
layout: post
title: Organizing your application using Modules (require.js)
type: intermediate
posturl: http://backbonetutorials.com/organizing-backbone-using-modules
---

# Organizing your application using Modules (require.js)

Unfortunately Backbone.js does not tell you how to organize your code, leaving many developers in the dark regarding how to load scripts and lay out their development environments.

This was quite a different decision to other JavaScript MVC frameworks who were more in favor of setting a development philosophy.

Hopefully this tutorial will allow you to build  a much more robust project with great separation of concerns between design and code.

This tutorial will get you started on combining Backbone.js with [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) (Asynchronous Module Definitions).

## What is AMD?

[Asynchronous Module Definitions](https://github.com/amdjs/amdjs-api/wiki/AMD) designed to load modular code asynchronously in the browser and server.   It is actually a fork of the Common.js specification.   Many script loaders have built their implementations around AMD, seeing it as the future of modular JavaScript development.

This tutorial will use [Require.js](http://requirejs.org) to implement a modular and organized Backbone.js.

**I highly recommend using AMD for application development**

Quick Overview

* Modular
* Scalable
* Compiles well(see [r.js](http://requirejs.org/docs/optimization.html) )
* Market Adoption( [Dojo 1.6 converted fully to AMD](http://dojotoolkit.org/reference-guide/releasenotes/1.6.html) )

## Why Require.js?

p. Require.js has a great community and it is growing rapidly.  [James Burke](http://tagneto.blogspot.com/) the author is married to Require.js and always responds to user feedback.   He is a leading expert in script loading and a contributer to the AMD specification.

<a href="https://twitter.com/jrburke" class="twitter-follow-button">Follow @jrburke</a>
<script src="//platform.twitter.com/widgets.js" type="text/javascript"></script>

## Getting started

To easily understand this tutorial you should jump straight into the example code base.

[Example Codebase](https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/examples/modular-backbone)

[Example Demo](http://backbonetutorials.com/examples/modular-backbone)


The tutorial is only loosely coupled with the example and you will find the example to be more comprehensive.

If you would like to see how a particular use case would be implemented please visit the GitHub page and create an issue.(Example Request: How to do nested views).

The example isn't super fleshed out but should give you a vague idea.

## Example File Structure

There are many different ways to lay out your files and I believe it is actually dependent on the size and type of the project.   In the example below views and templates are mirrored in file structure.  Collections and Models are categorized into folders kind of like an ORM.

{% highlight javascript %}
/* File Structure
├── imgs
├── css
│   └── style.css
├── templates
│   ├── projects
│   │   ├── list.html
│   │   └── edit.html
│   └── users
│       ├── list.html
│       └── edit.html
├── js
│   ├── libs
│   │   ├── jquery
│   │   │   ├── jquery.min.js
│   │   ├── backbone
│   │   │   ├── backbone.min.js
│   │   └── underscore
│   │   │   ├── underscore.min.js
│   ├── models
│   │   ├── users.js
│   │   └── projects.js
│   ├── collections
│   │   ├── users.js
│   │   └── projects.js
│   ├── views
│   │   ├── projects
│   │   │   ├── list.js
│   │   │   └── edit.js
│   │   └── users
│   │       ├── list.js
│   │       └── edit.js
│   ├── router.js
│   ├── app.js
│   ├── main.js  // Bootstrap
│   ├── order.js //Require.js plugin
│   └── text.js  //Require.js plugin
└── index.html

*/
{% endhighlight %}

To continue you must really understand what we are aiming towards as described in the introduction.

## Bootstrapping your application

Using Require.js we define a single entry point on our index page.
We should setup any useful containers that might be used by our Backbone views.

_Note: The data-main attribute on our single script tag tells Require.js to load the script located at "js/main.js".  It automatically appends the ".js"_

{% highlight html %}
<!doctype html>
<html lang="en">
<head>
	<title>Jackie Chan</title>
	<!-- Load the script "js/main.js" as our entry point -->
	<script data-main="js/main" src="js/libs/require/require.js"></script>
</head>
<body>

<div id="container">
  <div id="menu"></div>
  <div id="content"></div>
</div>

</body>
</html>
{% endhighlight %}

You should most always end up with quite a light weight index file.   You can serve this off your server and then the rest of your site off a CDN ensuring that everything that can be cached, will be. (You can also now serve the index file off the CDN using Cloudfront)

### What does the bootstrap look like?

Our bootstrap file will be responsible for configuring Require.js and loading initially important dependencies.

In the example below we configure Require.js to create a shortcut alias to commonly used scripts such as jQuery, Underscore and Backbone.

Unfortunately Backbone.js isn't AMD enabled so I downloaded the community managed repository and patched it on [amdjs](https://github.com/amdjs).

Hopefully if the AMD specification takes off these libraries will add code to allow themselves to be loaded asynchronously.   Due to this inconvenience the bootstrap is not as intuitive as it could be.

We also request a module called "app", this will contain the entirety of our application logic.

_Note: Modules are loaded relatively to the boot strap and always append with ".js".   So the module "app" will load "app.js" which is in the same directory as the bootstrap._

{% highlight javascript %}
// Filename: main.js

// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
  paths: {
    jquery: 'libs/jquery/jquery',
    underscore: 'libs/underscore/underscore',
    backbone: 'libs/backbone/backbone'
  }

});

require([

  // Load our app module and pass it to our definition function
  'app',
], function(App){
  // The "app" dependency is passed in as "App"
  App.initialize();
});

{% endhighlight %}

## How should we lay out external scripts?

Any modules we develop for our application using AMD/Require.js will be asynchronously loaded.

We have a heavy dependency on jQuery, Underscore and Backbone, unfortunately this libraries are loaded synchronously and also depend on each other existing in the global namespace.



## A boiler plate module

So before we start developing our application, let's quickly look over boiler plate code that will be reused quite often.

For convenience sake I generally keep a "boilerplate.js" in my application root so I can copy it when I need to.

{%highlight javascript %}
//Filename: boilerplate.js

define([
  // These are path alias that we configured in our bootstrap
  'jquery',     // lib/jquery/jquery
  'underscore', // lib/underscore/underscore
  'backbone'    // lib/backbone/backbone
], function($, _, Backbone){
  // Above we have passed in jQuery, Underscore and Backbone
  // They will not be accessible in the global scope
  return {};
  // What we return here will be used by other modules
});
{% endhighlight %}

The first argument of the define function is our dependency array, in the future we can pass in any modules we like.

## App.js Building our applications main module

Our applications main module should always remain light weight.   This tutorial only covers setting up a Backbone Router and initializing it in our main module.

The router will then load the correct dependencies depending on the current URL.

{% highlight javascript %}
// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone',
  'router', // Request router.js
], function($, _, Backbone, Router){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
    Router.initialize();
  }

  return {
    initialize: initialize
  };
});
{% endhighlight %}

{% highlight javascript %}
// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/projects/list',
  'views/users/list'
], function($, _, Backbone, ProjectListView, UserListView){
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      '/projects': 'showProjects',
      '/users': 'showUsers',

      // Default
      '*actions': 'defaultAction'
    }
  });

  var initialize = function(){
    var app_router = new AppRouter;
    app_router.on('showProjects', function(){
      // Call render on the module we loaded in via the dependency array
      // 'views/projects/list'
      var projectListView = new ProjectListView();
      projectListView.render();
    });
      // As above, call render on our loaded module
      // 'views/users/list'
    app_router.on('showUsers', function(){
      var userListView = new UserListView();
      userListView.render();
    });
    app_router.on('defaultAction', function(actions){
      // We have no matching route, lets just log what the URL was
      console.log('No route:', actions);
    });
    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});
{% endhighlight %}

## Modularizing a Backbone View

Backbone views usually interact with the DOM. Using our new modular system we can load in JavaScript templates using the Require.js text! plug-in.

{% highlight javascript %}
// Filename: views/project/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Using the Require.js text! plugin, we are loaded raw text
  // which will be used as our views primary template
  'text!templates/project/list.html'
], function($, _, Backbone, projectListTemplate){
  var ProjectListView = Backbone.View.extend({
    el: $('#container'),
    render: function(){
      // Using Underscore we can compile our template with data
      var data = {};
      var compiledTemplate = _.template( projectListTemplate, data );
      // Append our compiled template to this Views "el"
      this.$el.append( compiledTemplate );
    }
  });
  // Our module now returns our view
  return ProjectListView;
});
{% endhighlight %}

JavaScript templating allows us to separate the design from the application logic by placing all our HTML in the templates folder.

## Modularizing a Collection, Model and View

Now we put it altogether by chaining up a Model, Collection and View which is a typical scenario when building a Backbone.js application.

First we will define our model

{% highlight javascript %}
// Filename: models/project
define([
  'underscore',
  'backbone'
], function(_, Backbone){
  var ProjectModel = Backbone.Model.extend({
    defaults: {
      name: "Harry Potter"
    }
  });
  // Return the model for the module
  return ProjectModel;
});
{% endhighlight %}

Now that we have a model, our collection module can depend on it.  We will set the "model" attribute of our collection to the loaded module.  Backbone.js offers great benefits when doing this.

> Collection.model: Override this property to specify the model class that the collection contains. If defined, you can pass raw attributes objects (and arrays) to add, create, and reset, and the attributes will be converted into a model of the proper type.

{% highlight javascript %}
// Filename: collections/projects
define([
  'underscore',
  'backbone',
  // Pull in the Model module from above
  'models/project'
], function(_, Backbone, ProjectModel){
  var ProjectCollection = Backbone.Collection.extend({
    model: ProjectModel
  });
  // You don't usually return a collection instantiated
  return ProjectCollection;
});
{% endhighlight %}

Now we can simply depend on our collection in our view and pass it to our JavaScript template.

{% highlight javascript %}
// Filename: views/projects/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above
  'collections/projects',
  'text!templates/projects/list.html'
], function($, _, Backbone, ProjectsCollection, projectsListTemplate){
  var ProjectListView = Backbone.View.extend({
    el: $("#container"),
    initialize: function(){
      this.collection = new ProjectsCollection();
      this.collection.add({ name: "Ginger Kid"});
      // Compile the template using Underscores micro-templating
      var compiledTemplate = _.template( projectsListTemplate, { projects: this.collection.models } );
      this.$el.html(compiledTemplate);
    }
  });
  // Returning instantiated views can be quite useful for having "state"
  return ProjectListView;
});
{% endhighlight %}

## Conclusion

Looking forward to feedback so I can turn this post and example into quality references on building modular JavaScript applications.

Get in touch with me on twitter, comments or GitHub!

### Relevant Links

* [Organizing Your Backbone.js Application With Modules](http://bocoup.com/weblog/organizing-your-backbone-js-application-with-modules/)

### Contributors

* [Jakub Kozisek](https://github.com/dzejkej) (created modular-backbone-updated containing updated libs with AMD support)
