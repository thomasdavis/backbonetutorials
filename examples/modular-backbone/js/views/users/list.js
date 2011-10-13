// Filename: views/projects/list
define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/users/list.html'
], function($, _, Backbone, userListTemplate){
  var userListView = Backbone.View.extend({
    el: $("#page"),
    initialize: function(){
    },
    render: function(){
      var data = {};
      var compiledTemplate = _.template( userListTemplate, data );
      this.el.html( compiledTemplate ); 
    }
  });
  return new userListView;
});
