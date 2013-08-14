// Filename: views/projects/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above,
  'models/project/ProjectModel',
  'collections/projects/ProjectsCollection',
  'text!templates/projects/projectsListTemplate.html'

], function($, _, Backbone, ProjectModel, ProjectsCollection, projectsListTemplate){
  var ProjectListView = Backbone.View.extend({
    el: $("#projects-list"),

    render: function(){
      
      var data = {
        projects: this.collection.models,
        _: _ 
      };

      var compiledTemplate = _.template( projectsListTemplate, data );
      $("#projects-list").html( compiledTemplate ); 
    }
  });
  return ProjectListView;
});
