define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var SessionModel = Backbone.Model.extend({
  
    urlRoot: '/session',
    // When you implement user athentication
    login: function(creds, callback) {
      this.save(creds, {
         success: callback
      });
    },
    logout: function(callback) {
      this.destroy({
        success: callback
      });      
    },
    checkAuth: function() {}

  });
  return new SessionModel();

});
