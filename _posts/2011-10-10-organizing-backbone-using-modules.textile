---
layout: post
title: Organizing your application using Modules (require.js)
type: intermediate
posturl: http://backbonetutorials.com/organizing-backbone-using-modules
---

h2. Organizing your application using Modules (require.js)

p. Unfortunately Backbone.js does not tell you how to organize your code, leaving many developers in the dark regarding how to load scripts and lay out their development enviroments.

This was quite a different decision to other Javascript MVC frameworks who were more in favor of setting a development philosophy.

Hopefully this tutorial will allow you to build  a much more robust project with great separation of concerns between design and code.

This tutorial will get you started on combining Backbone.js with "AMD":https://github.com/amdjs/amdjs-api/wiki/AMD (Asynchronous Module Definitions).

h3. What is AMD?

p. "Asynchronous Module Definitions":https://github.com/amdjs/amdjs-api/wiki/AMD designed to load modular code asynchronously in the browser and server.   It is actually a fork of the Common.js specification.   Many script loaders have built their implementations around AMD, seeing it as the future of modular Javascript development.

This tutorial will use "Require.js":http://requirejs.org to implement a modular and organized Backbone.js.

**I highly recommend using AMD for application development**

Quick Overview
* Modular
* Scalable
* Compiles well(see "r.js":http://requirejs.org/docs/optimization.html)
* Market Adoption( "Dojo 1.6 converted fully to AMD":http://dojotoolkit.org/reference-guide/releasenotes/1.6.html )

h3. Why Require.js?

p. Require.js has a boastful community and is growing rapidly.  "James Burke":http://tagneto.blogspot.com/ the author is married to Require.js and responds to user feedback always.   A leading expert in script loading, he is also a contributer to the AMD specification.

<a href="https://twitter.com/jrburke" class="twitter-follow-button">Follow @jrburke</a>
<script src="//platform.twitter.com/widgets.js" type="text/javascript"></script>

h3. Getting started

To easily understand this tutorial you should jump straight into the example code base.

h3. "Example Codebase":https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/examples/modular-backbone

h3. "Example Demo":http://backbonetutorials.com/examples/modular-backbone


p. The tutorial is only loosely coupled with the example and you will find the example to be more comprehensive.

If you would like to see how a particuliar use case would be implemented please visit the Github page and create an issue.(Example Request: How to do nested views).

The example isn't super fleshed out but should give you a vague idea.

h3. Example File Structure

p. There are many different ways to lay out your files and I believe it is actually dependent on the size and type of the project.   In the example below views and templates are mirroed in file structure.  Collections and Models aren't categorized into folders kind of like an ORM.

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
│   │   │   └── jquery.js // jQuery Library Wrapper
│   │   ├── backbone
│   │   │   ├── backbone.min.js
│   │   │   └── backbone.js // Backbone Library Wrapper
│   │   └── underscore
│   │   │   ├── underscore.min.js
│   │   │   └── underscore.js // Underscore Library Wrapper
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

p. To continue you must really understand what we are aiming towards as described in the introduction.

h3. Bootstrapping your application

p. Using Require.js we define a single entry point on our index page.
We should setup any useful containers that might be used by our Backbone views.

**Note**: The data-main attribute on our single script tag tells Require.js to load the script located at "js/main.js".  It automatically appends the ".js"

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

p. You should most always end up with quite a light weight index file.   You can serve this off your server and then the rest of your site off a CDN ensuring that everything that can be cached, will be.

h4. What does the bootstrap look like?

p. Our bootstrap file will be responsible for configuring Require.js and loading initially important dependencies.

In the below example we configure Require.js to create shortcut alias to commonly used scripts such as jQuery, Underscore and Backbone.

Due to the nature of these libraries implementations we actually have to load them in order because they each depend on each other existing in the global namespace(which is bad but is all we have to work with).

Hopefully if the AMD specification takes off these libraries will add code to allow themselves to be loaded asynchronously.   Due to this inconvience the bootstrap is not as intuitive as it could be, I hope to solve this problem in the near future.

We also request a module called "app", this will contain the entireity of our application logic.

**Note:** Modules are loaded relativly to the boot strap and always append with ".js".   So the module "app" will load "app.js" which is in the same directory as the bootstrap.

{% highlight javascript %}
// Filename: main.js

// Require.js allows us to configure shortcut alias
// There usage will become more apparent futher along in the tutorial.
require.config({
  paths: {
    jQuery: 'libs/jquery/jquery',
    Underscore: 'libs/underscore/underscore',
    Backbone: 'libs/backbone/backbone'
  }

});

require([

  // Load our app module and pass it to our definition function
  'app',

  // Some plugins have to be loaded in order due to there non AMD compliance
  // Because these scripts are not "modules" they do not pass any values to the definition function below
  'order!libs/jquery/jquery-min',
  'order!libs/underscore/underscore-min',
  'order!libs/backbone/backbone-min'
], function(App){
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  App.initialize();
});

{% endhighlight %}

h3. How should we lay out external scripts?

p. Any modules we develop for our application using AMD/Require.js will be asynchronously loaded.

We have a heavy dependency on jQuery, Underscore and Backbone, unfortunatly this libraries are loaded synchronously and also depend on each other existing in the global namespace.

Below I propose a solution(until these libraries allow themselves to be loaded asynchronously) to allow these libraries to be loaded properly(synchronously) and also removing themselves from global scope.


{% highlight javascript %}
// Filename: libs/jquery/jquery.js

define([
// Load the original jQuery source file
  'order!libs/jquery/jquery-min'
], function(){
  // Tell Require.js that this module returns a reference to jQuery
  return $;
});
{% endhighlight %}

{% highlight javascript %}
// Filename: libs/underscore/underscore
// As above lets load the original underscore source code
define(['order!libs/underscore/underscore-min'], function(){
  // Tell Require.js that this module returns  a reference to Underscore
  return _;
});
{% endhighlight %}

{% highlight javascript %}
 // Filename: libs/backbone/backbone
 // Finally lets load the original backbone source code
define(['order!libs/backbone/backbone-min'], function(){
  // Now that all the orignal source codes have ran and accessed each other
  // We can call noConflict() to remove them from the global name space
  // Require.js will keep a reference to them so we can use them in our modules
  _.noConflict();
  $.noConflict();
  return Backbone.noConflict();
});
{% endhighlight %}

h3. A boiler plate module

p. So before we start developing our application, let's quickly look over boiler plate code that will be reused quite often.

For convience sake I generally keep a "boilerplate.js" in my application root so I can copy it when I need to.

{%highlight javascript %}
//Filename: boilerplate.js

define([
  // These are path alias that we configured in our bootstrap
  'jQuery',     // lib/jquery/jquery
  'Underscore', // lib/underscore/underscore
  'Backbone'    // lib/backbone/backbone
], function($, _, Backbone){
  // Above we have passed in jQuery, Underscore and Backbone
  // They will not be accesible in the global scope
  return {};
  // What we return here will be used by other modules
});
{% endhighlight %}

p. The first argument of the define function is our dependency array, we can pass in any modules we like in the future.

h3. App.js Building our applications main module

p. Our applications main module should always remain quite light weight.   This tutorial covers only setting up a Backbone Router and initializing it in our main module.

The router will then load the correct dependencies depending on the current URL.

{% highlight javascript %}
// Filename: app.js
define([
  'jQuery',
  'Underscore',
  'Backbone',
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
  'jQuery',
  'Underscore',
  'Backbone',
  'views/projects/list',
  'views/users/list'
], function($, _, Backbone, Session, projectListView, userListView){
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      '/projects': 'showProjects',
      '/users': 'showUsers',

      // Default
      '*actions": "defaultAction'
    },
    showProjects: function(){
      // Call render on the module we loaded in via the dependency array
      // 'views/projects/list'
      projectListView.render();
    },
      // As above, call render on our loaded module
      // 'views/users/list'
    showUsers: function(){
      userListView.render();
    },
    defaultAction: function(actions){
      // We have no matching route, lets just log what the URL was
      console.log('No route:', actions);
    }
  });

  var initialize = function(){
    var app_router = new AppRouter;
    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});
{% endhighlight %}

h3. Modularizing a Backbone View

Backbone views most usually always interact with the DOM, using our new modular system we can load in Javascript templates using Require.js text! plugin.

{% highlight javascript %}
// Filename: views/project/list
define([
  'jQuery',
  'Underscore',
  'Backbone',
  // Using the Require.js text! plugin, we are loaded raw text
  // which will be used as our views primary template
  'text!templates/project/list.html'
], function($, _, Backbone, projectListTemplate){
  var projectListView = Backbone.View.extend({
    el: $('#container'),
    render: function(){
      // Using Underscore we can compile our template with data
      var data = {};
      var compiledTemplate = _.template( projectListTemplate, data );
      // Append our compiled template to this Views "el"
      this.el.append( compiledTemplate );
    }
  });
  // Our module now returns an instantiated view
  // Sometimes you might return an un-instantiated view e.g. return projectListView
  return new projectListView;
});
{% endhighlight %}

p. Javascript templating allows us to seperate the design from the application logic placing all our html in the templates folder.

h3. Modularizing a Collection, Model and View

p. Now we put it altogether by chaining up a Model, Collection and View which is a typical scenairo when building a Backbone.js application.

First off we will define our model

{% highlight javascript %}
// Filename: models/project
define([
  'Underscore',
  'Backbone'
], function(_, Backbone){
  var projectModel = Backbone.Model.extend({
    defaults: {
      name: "Harry Potter"
    }
  });
  // You usually don't return a model instantiated
  return projectModel;
});
{% endhighlight %}

p. Now we have a model, our collection module can depend on it.  We will set the "model" attribute of our collection to the loaded module.  Backbone.js offers great benefits when doing this.

"Collection.model: Override this property to specify the model class that the collection contains. If defined, you can pass raw attributes objects (and arrays) to add, create, and reset, and the attributes will be converted into a model of the proper type."

{% highlight javascript %}
// Filename: collections/projects
define([
  'Underscore',
  'Backbone',
  // Pull in the Model module from above
  'models/project'
], function(_, Backbone, projectModel){
  var projectCollection = Backbone.Collection.extend({
    model: projectModel
  });
  // You don't usually return a collection instantiated
  return new projectCollection;
});
{% endhighlight %}

Now we can simply depend on our collection in our view and pass it to our Javascript template.

{% highlight javascript %}
// Filename: views/projects/list
define([
  'jQuery',
  'Underscore',
  'Backbone',
  // Pull in the Collection module from above
  'collections/projects',
  'text!templates/projects/list
], function(_, Backbone, projectsCollection, projectsListTemplate){
  var projectListView = Backbone.View.extend({
    el: $("#container"),
    initialize: function(){
      this.collection = new projectsCollection;
      this.collection.add({ name: "Ginger Kid"});
      // Compile the template using Underscores micro-templating
      var compiledTemplate = _.template( projectsListTemplate, { projects: this.collection.models } );
      this.el.html(compiledTemplate);
    }
  });
  // Returning instantiated views can be quite useful for having "state"
  return new projectListView;
});
{% endhighlight %}

h3. Conclusion

p. Looking forward to feedback so I can turn this post and example into quality references on building modular Javascript applications.

Get in touch with me on twitter, comments or github!

h3. Relevant Links

"Organizing Your Backbone.js Application With Modules":http://weblog.bocoup.com/organizing-your-backbone-js-application-with-modules



h3. Author

* "Thomas Davis":https://github.com/thomasdavis

h3. Contributors

* "Jakub Kozisek":https://github.com/dzejkej (created modular-backbone-updated containing updated libs with AMD support)
