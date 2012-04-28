define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){
  var Messages = Backbone.Collection.extend({
    url: function () {
      return 'http://search.twitter.com/search.json?q=blue%20angels&page=' + this.page + '&callback=?'
    },
    parse: function(resp, xhr) {
      return resp.results;
    },
    page: 1
  });

  return Messages;
});
