define([
  'jquery',
  'underscore',
  'backbone',
  'models/projects'
], function($, _, Backbone, ProjectsModel){
  var ProjectsCollection = Backbone.Collection.extend({
    model: ProjectsModel,
    initialize: function(){

    }

  });
 
  return ProjectsCollection;
});
