---
layout: post
title: What is a router?
type: beginner
posturl: http://backbonetutorials.com/what-is-a-router
---

# What is a router?

Backbone routers are used for routing your applications URL's when using hash tags(#).   In the traditional MVC sense they don't necessarily fit the semantics and if you have read "[What is a view?](http://backbonetutorials.com/what-is-a-view)" it will elaborate on this point.   Though a Backbone "router" is still very useful for any application/feature that needs URL routing/history capabilities.   

Defined routers should always contain at least one route and a function to map the particular route to.   In the example below we are going to define a route that is always called.

Also note that routes interpret anything after "#" tag in the URL.   All links in your application should target "#/action" or "#action".   (Appending a forward slash after the hashtag looks a bit nicer e.g. http://example.com/#/user/help)

{% highlight html %}

<script>
    var AppRouter = Backbone.Router.extend({
        routes: {
            "*actions": "defaultRoute" // matches http://example.com/#anything-here
        }
    });
    // Initiate the router
    var app_router = new AppRouter;

    app_router.on('route:defaultRoute', function(actions) {
        alert(actions);
    })

    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();

</script>
{% endhighlight %}

[Activate route](#action)

[Activate another route](#/route/action)

_Notice the change in the url_


## Dynamic Routing

Most conventional frameworks allow you to define routes that contain a mix of static and dynamic route parameters. For example you might want to retrieve a post with a variable id with a friendly URL string. Such that your URL would look like "http://example.com/#/posts/12".   Once this route was activated you would want to access the id given in the URL string.   This example is implemented below.

{% highlight html %}

<script>
    var AppRouter = Backbone.Router.extend({
        routes: {
            "posts/:id": "getPost",
            "*actions": "defaultRoute" // Backbone will try to match the route above first
        }
    });
    // Instantiate the router
    var app_router = new AppRouter;
    app_router.on('route:getPost', function (id) {
        // Note the variable in the route definition being passed in here
        alert( "Get post number " + id );   
    });
    app_router.on('route:defaultRoute', function (actions) {
        alert( actions ); 
    });
    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();

</script>
{% endhighlight %}

[Post 120](#/posts/120)

[Post 130](#/posts/130)

_Notice the change in the url_


## Dynamic Routing Cont. ":params" and "\*splats"

Backbone uses two styles of variables when implementing routes.   First there are ":params" which match any URL components between slashes.  Then there are "\*splats" which match any number of URL components.   Note that due to the nature of a "\*splat" it will always be the last variable in your URL as it will match any and all components.

Any "\*splats" or ":params" in route definitions are passed as arguments (in respective order) to the associated function.  A route defined as "/:route/:action" will pass 2 variables (“route” and “action”) to the callback function.     (If this is confusing please post a comment and I will try articulate it better)

Here are some examples of using ":params" and "*splats"

{% highlight javascript %}

        routes: {
        
            "posts/:id": "getPost",
            // <a href="http://example.com/#/posts/121">Example</a>
            
            "download/*path": "downloadFile",
            // <a href="http://example.com/#/download/user/images/hey.gif">Download</a>
            
            ":route/:action": "loadView",
            // <a href="http://example.com/#/dashboard/graph">Load Route/Action View</a>
            
        },
        
        app_router.on('route:getPost', function( id ){ 
            alert(id); // 121 
        });
        app_router.on('route:downloadFile', function( path ){ 
            alert(path); // user/images/hey.gif 
        });
        app_router.on('route:loadView', function( route, action ){ 
            alert(route + "_" + action); // dashboard_graph 
        });

{% endhighlight %}

Routes are quite powerful and in an ideal world your application should never contain too many.   If you need to implement hash tags with SEO in mind, do a google search for "google seo hashbangs". Also check out [Seo Server](http://seo.apiengine.io)

Remember to do a pull request for any errors you come across.

### Relevant Links
* [Backbone.js official router documentation](http://backbonejs.org/#Router)
* [Using routes and understanding the hash tag](http://thomasdavis.github.com/2011/02/07/making-a-restful-ajax-app.html)

### Contributors

* [Herman Schistad](http://schistad.info) - (Backbone 0.5 rename from Controller to Router)
* [Paul Irish](http://paulirish.com)
