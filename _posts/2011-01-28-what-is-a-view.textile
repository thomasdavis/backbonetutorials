---
layout: post
title: What is a view?
type: beginner
posturl: http://backbonetutorials.com/what-is-a-view
---

h2. What is a view?

p. Backbone views are used to reflect what your applications' data models look like. They are also used to listen to events and react accordingly. This tutorial will not be addressing how to bind models and collections to views but will focus on view functionality and how to use views with a JavaScript templating library, specifically "Underscore.js's _.template":http://documentcloud.github.com/underscore/#template.

We will be using "jQuery 1.5":http://jquery.com/ as our DOM manipulator. It's possible to use other libraries such as "MooTools":http://mootools.net/ or "Sizzle":http://sizzlejs.com/, but official Backbone.js documentation endorses jQuery. Backbone.View events may not work with other libraries other than jQuery.

For the purposes of this demonstration, we will be implementing a search box. "A live example":http://jsfiddle.net/thomas/C9wew/6 can be found on jsFiddle.

{% highlight javascript %}
    SearchView = Backbone.View.extend({
        initialize: function(){
            alert("Alerts suck.");
        }
    });

    // The initialize function is always called when instantiating a Backbone View.
    // Consider it the constructor of the class.
    var search_view = new SearchView;
{% endhighlight %}

h4. The "el" property

p. The "el" property references the DOM object created in the browser. Every Backbone.js view has an "el" property, and if it not defined, Backbone.js will construct its own, which is an empty div element.

Let us set our view's "el" property to div#search_container, effectively making Backbone.View the owner of the DOM element.

{% highlight html %}
<div id="search_container"></div>

<script type="text/javascript">
	SearchView = Backbone.View.extend({
		initialize: function(){
			alert("Alerts suck.");
		}
	});
	
	var search_view = new SearchView({ el: $("#search_container") });
</script>
{% endhighlight %}

p. *Note*: Keep in mind that this binds the container element. Any events we trigger must be in this element.

h4. Loading a template

p. Backbone.js is dependent on Underscore.js, which includes its own micro-templating solution. Refer to "Underscore.js's documentation":http://documentcloud.github.com/underscore/ for more information.

Let us implement a "render()" function and call it when the view is initialized. The "render()" function will load our template into the view's "el" property using jQuery.

{% highlight html %}
<div id="search_container"></div>

<script type="text/javascript">
	SearchView = Backbone.View.extend({
		initialize: function(){
			this.render();
		},
		render: function(){
			// Compile the template using underscore
			var template = _.template( $("#search_template").html(), {} );
			// Load the compiled HTML into the Backbone "el"
			this.el.html( template );
		}
	});
	
	var search_view = new SearchView({ el: $("#search_container") });
</script>

<script type="text/template" id="search_template">
	<label>Search</label>
	<input type="text" id="search_input" />
	<input type="button" id="search_button" value="Search" />
</script>
{% endhighlight %}

p. *Tip*: Place all your templates in a file and serve them from a CDN. This ensures your users will always have your application cached.

h4. Listening for events

p. To attach a listener to our view, we use the "events" attribute of Backbone.View. Remember that event listeners can only be attached to child elements of the "el" property. Let us attach a "click" listener to our button.

{% highlight html %}
<div id="search_container"></div>

<script type="text/javascript">
    SearchView = Backbone.View.extend({
        initialize: function(){
            this.render();
        },
        render: function(){
            var template = _.template( $("#search_template").html(), {} );
            this.el.html( template );
        },
        events: {
            "click input[type=button]": "doSearch"
        },
        doSearch: function( event ){
            // Button clicked, you can access the element that was clicked with event.currentTarget
            alert( "Search for " + $("#search_input").val() );
        }
    });

    var search_view = new SearchView({ el: $("#search_container") });
</script>

<script type="text/template" id="search_template">
	<label>Search</label>
	<input type="text" id="search_input" />
	<input type="button" id="search_button" value="Search" />
</script>
{% endhighlight %}


h4. Tips and Tricks

p. *Using template variables*

{% highlight html %}
<div id="search_container"></div>

<script type="text/javascript">
	 SearchView = Backbone.View.extend({
		initialize: function(){
			this.render();
		},
		render: function(){
			//Pass variables in using Underscore.js Template
			var variables = { search_label: "My Search" };
			// Compile the template using underscore
			var template = _.template( $("#search_template").html(), variables );
			// Load the compiled HTML into the Backbone "el"
			this.el.html( template );
		},
		events: {
			"click input[type=button]": "doSearch"  
		},
		doSearch: function( event ){
			// Button clicked, you can access the element that was clicked with event.currentTarget
			alert( "Search for " + $("#search_input").val() );
		}
	});
		
	var search_view = new SearchView({ el: $("#search_container") });
</script>

<script type="text/template" id="search_template">
    <!-- Access template variables with <%= %> -->
    <label><%= search_label %></label>
    <input type="text" id="search_input" />
    <input type="button" id="search_button" value="Search" />
</script>
{% endhighlight %}

p.  If you have any questions, leave a comment below.

h3. Relevant Links
* "Backbone.js official website":http://documentcloud.github.com/backbone/
* "This example implemented with google API":http://thomasdavis.github.com/2011/02/05/backbone-views-and-templates.html
* "This examples exact code on jsfiddle.net":http://jsfiddle.net/thomas/C9wew/4/
* "Another semi-complete example on jsFiddle":http://jsfiddle.net/thomas/dKK9Y/6/

h3. Author

* "Thomas Davis":https://github.com/thomasdavis

h3. Contributors

* "Michael Macias":https://github.com/zaeleus
