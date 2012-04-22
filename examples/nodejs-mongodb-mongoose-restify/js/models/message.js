define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var Message = Backbone.Model.extend({
      //url: 'http://localhost:8080/messages'
      url: 'http://backbonetutorials.nodejitsu.com/messages'
  });
  return Message;
});
