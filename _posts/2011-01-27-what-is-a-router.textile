---
layout: post
title: What is a router?
type: beginner
posturl: http://backbonetutorials.com/what-is-a-router
---

h2. What is a router?

p. Backbone routers are used for routing your applications URL's when using hash tags(#).   In the traditional MVC sense they don't neccesarily fit the semantics and if you have read ""What is a view?":http://backbonetutorials.com/what-is-a-view" it will elaborate on this point.   Though a Backbone "router" is still very useful for any application/feature that needs URL routing/history capabilities.   

Defined routers should always contain at least one route and a function to map the particular route to.   In the example below we are going to define a route that is always called.

Also note that routes intepret anything after "#" tag in the url.   All links in your application should target "#/action" or "#action".   (Appending a forward slash after the hashtag looks a bit nicer e.g. http://example.com/#/user/help)

{% highlight html %}

<script>
    var AppRouter = Backbone.Router.extend({
        routes: {
            "*actions": "defaultRoute" // matches http://example.com/#anything-here
        },
        defaultRoute: function( actions ){
            // The variable passed in matches the variable in the route definition "actions"
            alert( actions ); 
        }
    });
    // Initiate the router
    var app_router = new AppRouter;
    // Start Backbone history a neccesary step for bookmarkable URL's
    Backbone.history.start();

</script>

<a href="#action">Activate route</a>
<a href="#/route/action">Activate another route</a>
<!-- Notice the change in the url -->

{% endhighlight %}

*Please note: * Prior to Backbone 0.5 (released 1. July 2011) a Router was called a Controller. To avoid confusion, the Backbone developers changed the name to Router. Hence, if you find yourself using an older version of Backbone you should write Backbone.Controller.extend({ ** });

h4. Dynamic Routing

p. Most conventional frameworks allow you to define routes that contain a mix of static and dynamic route parameters. For example you might want to retrieve a post with a variable id with a friendly URL string. Such that your URL would look like "http://example.com/#/posts/12".   Once this route was activated you would want to access the id given in the URL string.   This example is implemented below.

{% highlight html %}

<script>
    var AppRouter = Backbone.Router.extend({
        routes: {
            "/posts/:id": "getPost",
            "*actions": "defaultRoute" // Backbone will try match the route above first
        },
        getPost: function( id ) {
            // Note the variable in the route definition being passed in here
            alert( "Get post number " + id );   
        },
        defaultRoute: function( actions ){
            alert( actions ); 
        }
    });
    // Instantiate the router
    var app_router = new AppRouter;
    // Start Backbone history a neccesary step for bookmarkable URL's
    Backbone.history.start();

</script>

<a href="#/posts/120">Post 120</a>
<a href="#/posts/130">Post 130</a>
<!-- Notice the change in the url -->

{% endhighlight %}

h4. Dynamic Routing Cont. ":params" and "*splats"

p. Backbone uses two styles of variables when implementing routes.   First there are ":params" which match any URL components between slashes.  Then there are "*splats" which match any number of URL components.   Note that due to the nature of a "*splat" it will always be the last variable in your URL as it will match any and all components.

Any "*splats" or ":params" in route definitions are passed as arguments (in respective order) to the associated function.  A route defined as "/:route/:action" will pass 2 variables (“route” and “action”) to the callback function.     (If this is confusing please post a comment and I will try articulate it better)

Here are some examples of using ":params" and "*splats"

{% highlight javascript %}

        routes: {
        
            "/posts/:id": "getPost",
            // <a href="http://example.com/#/posts/121">Example</a>
            
            "/download/*path": "downloadFile",
            // <a href="http://example.com/#/download/user/images/hey.gif">Download</a>
            
            "/:route/:action": "loadView",
            // <a href="http://example.com/#/dashboard/graph">Load Route/Action View</a>
            
        },
        
        getPost: function( id ){ 
            alert(id); // 121 
        },
        downloadFile: function( path ){ 
            alert(path); // user/images/hey.gif 
        },
        loadView: function( route, action ){ 
            alert(route + "_" + action); // dashboard_graph 
        }

{% endhighlight %}

p. Routes are quite powerful and in an ideal world your application should never contain too many.   If you need to implement hash tags with SEO in mind, do a google search for "google seo hashbangs".

Remember to do a pull request for any errors you come across.

h4. Tips and Tricks

p. No Tips and Tricks

h3. Relevant Links
* "Backbone.js official router documentation":http://documentcloud.github.com/backbone/#Router
* "Using routes and understanding the hash tag":http://thomasdavis.github.com/2011/02/07/making-a-restful-ajax-app.html

h3. Author

* "Thomas Davis":https://github.com/thomasdavis

h3. Contributors

* "Herman Schistad":http://schistad.info (Backbone 0.5 rename from Controller to Router)
* "Paul Irish":http://paulirish.com
