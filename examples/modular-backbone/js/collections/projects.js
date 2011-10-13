define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/projects'
], function($, _, Backbone, projectsModel){
  var projectsCollection = Backbone.Collection.extend({
    Model: projectsModel,
    initialize: function(){

    }

  });
 
  return new projectsCollection;
});
