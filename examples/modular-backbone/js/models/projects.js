define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var ProjectsModel = Backbone.Model.extend({
    defaults: {
      score: 10
    },
    initialize: function(){
    }
    
  });
  return ProjectsModel;

});
