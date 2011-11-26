define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var projectsModel = Backbone.Model.extend({
    defaults: {
      score: 10
    },
    initialize: function(){
    }

  });
  return projectsModel;

});
