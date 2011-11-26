// Filename: views/projects/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above
  'collections/projects',
  'text!templates/projects/list.html'

], function($, _, Backbone, projectsCollection, projectListTemplate){
  var projectListView = Backbone.View.extend({
    el: $("#page"),
    initialize: function(){
      this.collection = projectsCollection;
      this.collection.bind("add", this.exampleBind);
      this.collection = projectsCollection.add({ name: "Twitter"});
      this.collection = projectsCollection.add({ name: "Facebook"});
      this.collection = projectsCollection.add({ name: "Myspace", score: 20});
    },
    exampleBind: function( model ){
      //console.log(model);
    },
    render: function(){
      var data = {
        projects: this.collection.models,
        _: _
      };
      var compiledTemplate = _.template( projectListTemplate, data );
      $("#page").html( compiledTemplate );
    }
  });
  return new projectListView;
});
