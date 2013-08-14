define([
  'jquery',
  'underscore',
  'backbone',
  'vm',
	'events',
  'models/session',
  'text!templates/layout.html' 
], function($, _, Backbone, Vm, Events, Session, layoutTemplate){
  var AppView = Backbone.View.extend({
    el: '.container',
    initialize: function () {
      
      // This snipper should usually be loaded elsewhere
      // It simply takes a <form> and converts its values to an object
      $.fn.serializeObject = function() {
          var o = {};
          var a = this.serializeArray();
          $.each(a, function() {
              if (o[this.name] !== undefined) {
                  if (!o[this.name].push) {
                      o[this.name] = [o[this.name]];
                  }
                  o[this.name].push(this.value || '');
              } else {
                  o[this.name] = this.value || '';
              }
          });
          return o;
      };
    
    
      $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
        // Your server goes below
         options.url = 'http://localhost:8000' + options.url;
        // options.url = 'http://cross-domain.nodejitsu.com' + options.url;
      });
    
    },
    render: function () {
			var that = this;
      $(this.el).html(layoutTemplate);
      // This is the entry point to your app, therefore
      // when the user refreshes the page we should
      // really know if they're authed. We will give it
      // A call back when we know what the auth status is
      Session.getAuth(function () {
        Backbone.history.start();
      })
		} 
	});
  return AppView;
});
