// Filename: views/projects/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above
  'collections/projects',
  'text!templates/projects/list.html'

], function($, _, Backbone, ProjectsCollection, projectListTemplate){
  var projectListView = Backbone.View.extend({
    el: $("#page"),
    initialize: function(){
      this.collection = new ProjectsCollection();
      this.collection.bind("add", this.exampleBind);
      this.collection = this.collection.add({ name: "Twitter"});
      this.collection = this.collection.add({ name: "Facebook"});
      this.collection = this.collection.add({ name: "Myspace", score: 20});
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
      this.$el.html( compiledTemplate ); 
    }
  });
  return projectListView;
});
