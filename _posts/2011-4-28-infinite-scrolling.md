---
layout: post
title: Lightweight Infinite Scrolling using Twitter API
type: intermediate
posturl: http://backbonetutorials.com/infinite-scroll
---

# Lightweight Infinite Scrolling using Twitter API


## Getting started

In this example we are going to build a widget that pulls in tweets and when the user scrolls to the bottom of the widget Backbone.js will re-sync with the server to bring down the next page of results.

[Example Demo](http://backbonetutorials.com/examples/infinite-scroll/)

[Example Source](https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/examples/infinite-scroll)

_Note: This tutorial will use [AMD](http://backbonetutorials.com/organizing-backbone-using-modules) for modularity._

## The Twitter Collection

Twitter offers a jsonp API for browsing tweets.  The first thing to note is that we have to append '&callback?' to allow cross domain Ajax calls which is a feature of [jsonp](http://en.wikipedia.org/wiki/JSONP).

Using the 'q' and 'page' query parameters we can find the results we are after.  In the collection definition below we have set some defaults which can be overridden at any point.

Twitter's search API actually returns a whole bunch of meta information alongside the results.  Though this is a problem for Backbone.js because a Collection expects to be populated with an array of objects. So in our collection definition we can override the Backbone.js default parse function to instead choose the correct property to populate the collection.  

{% highlight javascript %}
// collections/twitter.js
define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){
  var Tweets = Backbone.Collection.extend({
    url: function () {
      return 'http://search.twitter.com/search.json?q=' + this.query + '&page=' + this.page + '&callback=?'
    },
    // Because twitter doesn't return an array of models by default we need
    // to point Backbone.js at the correct property
    parse: function(resp, xhr) {
      return resp.results;
    },
    page: 1,
    query: 'backbone.js tutorials'
  });

  return Tweets;
});
{% endhighlight %}
    
_Note: Feel free to attach the meta information returned by Twitter to the collection itself e.g._

{% highlight javascript %}
parse: function(resp, xhr) {
  this.completed_in = resp.completed_in
  return resp.results;
},
{% endhighlight %}

## Setting up the View

The first thing to do is to load our Twitter collection and template into the widget module. We should attach our collection to our view in our `initialize` function. `loadResults` will be responsible for calling fetch on our Twitter collection. On success we will append the latest results to our widget using our template. Our Backbone.js `events` will listen for `scroll` on the current `el` of the view which is '.twitter-widget'. If the current `scrollTop` is at the bottom then we simply increment the Twitter collections current page property and call `loadResults` again.
  
{% highlight javascript %}
// views/twitter/widget.js
define([
  'jquery',
  'underscore',
  'backbone',
  'vm',
  'collections/twitter',
  'text!templates/twitter/list.html'
], function($, _, Backbone, Vm, TwitterCollection, TwitterListTemplate){
  var TwitterWidget = Backbone.View.extend({
    el: '.twitter-widget',
    initialize: function () {
      // isLoading is a useful flag to make sure we don't send off more than
      // one request at a time
      this.isLoading = false;
      this.twitterCollection = new TwitterCollection();
    },
    render: function () {
      this.loadResults();
    },
    loadResults: function () {
      var that = this;
      // we are starting a new load of results so set isLoading to true
      this.isLoading = true;
      // fetch is Backbone.js native function for calling and parsing the collection url
      this.twitterCollection.fetch({ 
        success: function (tweets) {
          // Once the results are returned lets populate our template
          $(that.el).append(_.template(TwitterListTemplate, {tweets: tweets.models, _:_}));
          // Now we have finished loading set isLoading back to false
          that.isLoading = false;
        }
      });      
    },
    // This will simply listen for scroll events on the current el
    events: {
      'scroll': 'checkScroll'
    },
    checkScroll: function () {
      var triggerPoint = 100; // 100px from the bottom
        if( !this.isLoading && this.el.scrollTop + this.el.clientHeight + triggerPoint > this.el.scrollHeight ) {
          this.twitterCollection.page += 1; // Load next page
          this.loadResults();
        }
    }
  });
  return TwitterWidget;
});
{% endhighlight %}

_Note: `triggerPoint` will allow you to set an offset where the user has to scroll to before loading the next page_

## The widget template

Our view above passes into our underscore template the variable tweets which we can simply iterate over with using underscore's `each` method.

{% highlight javascript %}
<!-- templates/twitter/list.html -->
<ul class="tweets">
<% _.each(tweets, function (tweet) { %>

  <li><%= tweet.get('text') %></li> 

<% }); %>
</ul>
{% endhighlight %}

## Conclusion

This is a very lightweight but robust infinite scroll example. There are caveats to using infinite scroll in UI/UX so make sure to only use it when applicable.

[Example Demo](http://backbonetutorials.com/examples/infinite-scroll/)

[Example Source](https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/examples/infinite-scroll)
