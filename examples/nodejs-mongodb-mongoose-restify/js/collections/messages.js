define([
  'jquery',
  'underscore',
  'backbone',
  'models/message'
], function($, _, Backbone, MessageModel){
  var Messages = Backbone.Collection.extend({
    model: MessageModel,
    //url: 'http://localhost:8080/messages'
    url: 'http://backbonetutorials.nodejitsu.com/messages'
  });

  return Messages;
});
