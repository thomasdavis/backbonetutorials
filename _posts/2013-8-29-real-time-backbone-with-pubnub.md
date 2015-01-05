---
layout: post
title: Real-Time Backbone With PubNub
type: intermediate
posturl: http://backbonetutorials.com/real-time-backbone-with-pubnub
---

# Real-Time Backbone With PubNub

Backbone is one of the most popular JavaScript based frameworks to date. It is a simple yet powerful way to create interactive JavaScript applications with data bindings to a back-end server. Instead of having to constantly synchronize data between your client and server though, why not have all the data there when it happens? Users should not have to wait to see updates to their model’s data so we decided to tackle this problem by integrating Backbone.js with PubNub.

![PubnNub and Backbone](http://blogly.pubnub.com/wp-content/uploads/2013/08/PubNubBackboneJS.png)

Our integration allows developers to create a Backbone model or collection and have them synchronize with every other client instance of those models or collections in real-time. This will give any Backbone application a better user experience when working with collaborative, social, or any type of multi-user interface. It works by taking all of the create, update, and delete methods that are spawned by Backbone and propagating them across the PubNub real-time network.

Want to see it in action? A full working tutorial and all the code you need is available at our [GitHub page](http://pubnub.github.io/backbone/)

## Getting Started

The easiest way to get started is by using bower via `bower install pubnub-backbone`. You can also clone the repository and copy the built javascript files. Now you can include this and the base PubNub library found at [https://github.com/pubnub/javascript#pubnub-cdn-javascript-sdk](https://github.com/pubnub/javascript#pubnub-cdn-javascript-sdk) like so:

{% highlight html %}
<script src="http://cdn.pubnub.com/pubnub.min.js"></script>
<script src="/path/to/backbone-pubnub.min.js"></script>
{% endhighlight %}

The easiest way to get started using the library is by creating a PubNub based collection. This will automatically propagate all create, update, and delete methods across all other clients in real-time. This requires creating a free account to get your API keys at [http://www.pubnub.com/get-started](http://www.pubnub.com/get-started) and then initializing a global PubNub instance:

{% highlight javascript %}
var pubnub = PUBNUB.init({
  publish_key: 'demo',
  subscribe_key: 'demo'
});
{% endhighlight %}

## Creating a Real-Time Collection

Now that we have a connection to PubNub, we can feed that connection into our custom Backbone collection:

{% highlight javascript %}
var MyCollection = Backbone.PubNub.Collection.extend({
  name: 'MyCollection',
  pubnub: pubnub
});
{% endhighlight %}

This will look and act just like a normal Backbone collection with two extra keys. The “name” key allows PubNub to distinguish this collection, so it connects this collections to only collections of the same type. Think of this as a namespace so you can have multiple types of collections all updating in real-time. It uses this to generate a PubNub channel that is unique to the collection in the form of "backbone-collection-{name}". The "pubnub" property is the globally referenced connection to the PubNub network. This is the object that comes back after calling PUBNUB.init.

Now your Backbone collection will update in real-time. You can listen for add and remove events just like usual when something gets added or removed in real-time. The next step is to implement a way to get the current set of data when the collection first loads so every client is using the same data set. A great way of accomplishing this is by listening to the PubNub based events with a server and replicating the data store. Then the client can ask for the current set of data every time the application loads. This is made even simpler when using the backbone npm module for nodejs:

{% highlight javascript %}
var _ = require('underscore')._,
    Backbone = require('backbone'),
    pubnub = require('pubnub').init({
      publish_key: 'demo',
      subscribe_key: 'demo'
    });
    
var MyCollection = Backbone.Collection.extend({
  // Add business logic here
});
 
var myCollection = new MyCollection();
 
pubnub.subscribe({
  channel: 'backbone-collection-MyCollection', // This is what is created internally by the framework
  callback: function (message) {
    var data = JSON.parse(message); // All data is transferred as JSON
    
    if (data.method === 'create') {
      myCollection.add(data.model);
    } else if (data.method === 'update') {
      myCollection.remove(data.model);
    } else if (data.method === 'delete') {
      var record = _.find(myCollection.models, function (record) {
        return record.id === data.model.id;
      });
      
      if (record == null) {
        console.log("Could not record: " + model.id);
      }
      
      var diff = _.difference(_.keys(record.attributes), _.keys(data.model));
      _.each(diff, function(key) {
        return record.unset(key);
      });
      
      return record.set(data.model, data.options);
    }
  }
});
 
// Now myCollection will always be up to date.
// Here you can provide some way (i.e. http.createServer) to get the data from the server.
{% endhighlight %}

Now you can listen for all the changes to the collection and either store them in memory or even a database such as MongoDB. You can even add other business logic for validations and more. Although nodejs was an obvious choice for the demo, this code will work with any type of back end too. This is just one easy way to use the framework but be sure to check out the repository for more examples!

We here at PubNub truly believe that real-time is the way of the future. Your users will not have to click a refresh button to constantly synchronize their Backbone client data with a server. Instead, with PubNub integration, your users will get data right when it happens. This is also much more extensible since any client or server can listen to the events and manipulate them as they need to. This allows business logic to lay in more places than one. We really hope this changes the way developers look at building not just Backbone applications but web applications overall.

You can read more about PubNub at [our website](http://pubnub.com) and more about Backbone integration at [our GitHub page](http://pubnub.github.io/backbone/)
