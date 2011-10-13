define([
  'Underscore',
  'Backbone'
], function(_, Backbone) {
  var projectsModel = Backbone.Model.extend({
    defaults: {
      test: "tomasomas"
    },
    initialize: function(){
      console.log("Hi Nicola");
    }
    
  });
  return new projectsModel;

});
