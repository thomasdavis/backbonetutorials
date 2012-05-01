define([
  'jquery',
  'underscore',
  'backbone',
  'models/session',
  'text!templates/example/page.html'
], function($, _, Backbone, Session, examplePageTemplate){
  var ExamplePage = Backbone.View.extend({
    el: '.page',
    initialize: function () {
  
    },
    render: function () {
      this.$el.html(examplePageTemplate);
    },
    // This will simply listen for scroll events on the current el
    events: {
      'submit form.login': 'login',
      'click .logout': 'logout'
    },
    login: function (ev) {
      var that = this;
 
      var creds = $(ev.currentTarget).serializeObject();
      Session.login(creds, function () {
          that.updateSessionStatus('Authed');
      });
      return false;
    },
    logout: function () {
      Session.logout(function () {
          that.updateSessionStatus('Un-Authed');
      });
    },
    updateSessionStatus: function(response) {
      $('.session-status').html(response);
    }
  });
  return ExamplePage;
});
