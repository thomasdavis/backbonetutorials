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
    query: 'backbone.js'
  });

  return Tweets;
});
