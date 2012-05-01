define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var SessionModel = Backbone.Model.extend({
  
    urlRoot: '/session',
    
    login: function(creds) {
      // Do a POST to /session and send the serialized form creds
      this.save(creds, {
         success: function () {}
      });
    },
    logout: function() {
      // Do a DELETE to /session and clear the clientside data
      var that = this;
      this.destroy({
        success: function (model) {
          model.clear()
          // Set auth to false to trigger a change:auth event
          that.set({auth: false});
        }
      });      
    },
    getAuth: function(callback) {
      // getAuth is wrapped around our router
      // before we start any routers let us see if the user is valid
      this.fetch({
          success: callback
      });
    }
  });
  return new SessionModel();

});
