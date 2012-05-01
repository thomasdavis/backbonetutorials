define([
  'jquery',
  'underscore',
  'backbone',
  'vm',
	'events',
  'text!templates/layout.html' 
], function($, _, Backbone, Vm, Events, layoutTemplate){
  var AppView = Backbone.View.extend({
    el: '.container',
    initialize: function () {
      
          
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
      options.url = 'http://cross-domain.nodejitsu.com' + options.url;
      options.xhrFields = {
        withCredentials: true
      };
    });
    
    },
    render: function () {
			var that = this;
      $(this.el).html(layoutTemplate);
      Backbone.history.start();
		} 
	});
  return AppView;
});
