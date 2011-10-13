// Filename: views/projects/list
define([
  'jQuery',
  'Underscore',
  'Backbone',
  // Pull in the Collection module from above
  'collections/projects',
  'text!templates/projects/list.html'

], function($, _, Backbone, projectsCollection, projectListTemplate){
  var projectListView = Backbone.View.extend({
    el: $("#page"),
    initialize: function(){
      this.collection = projectsCollection;
      this.collection.bind("add", this.something);
      this.collection = projectsCollection.add({ user: "Asd"});
    },
    something: function(){
      console.log("qwe");
    },
    render: function(){
      var data = {};
      var compiledTemplate = _.template( projectListTemplate, data );
      $("#page").html( compiledTemplate ); 
    }
  });
  return new projectListView;
});
