define([
  'jquery',
  'underscore',
  'backbone',
  'models/session',
  'text!templates/example/login.html',
  'text!templates/example/logout.html'
], function($, _, Backbone, Session, exampleLoginTemplate, exampleLogoutTemplate){
  var ExamplePage = Backbone.View.extend({
    el: '.page',
    initialize: function () {
      var that = this;
      // Bind to the Session auth attribute so we
      // make our view act recordingly when auth changes
      Session.on('change:auth', function (session) {
          that.render();
      });
    },
    render: function () {
      // Simply choose which template to choose depending on
      // our Session models auth attribute
      if(Session.get('auth')){
        this.$el.html(_.template(exampleLogoutTemplate, {username: Session.get('username')}));
      } else {
        this.$el.html(exampleLoginTemplate); 
      }
    },
    events: {
      'submit form.login': 'login', // On form submission
      'click .logout': 'logout'
    },
    login: function (ev) {
      // Disable the button
      $('[type=submit]', ev.currentTarget).val('Logging in').attr('disabled', 'disabled');
      // Serialize the form into an object using a jQuery plgin
      var creds = $(ev.currentTarget).serializeObject();
      Session.login(creds);
      return false;
    },
    logout: function (ev) {
      // Disable the button
      $(ev.currentTarget).text('Logging out').attr('disabled', 'disabled');
      Session.logout();
    }
  });
  return ExamplePage;
});
