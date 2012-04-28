// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
	'vm'
], function ($, _, Backbone, Vm) {
  var AppRouter = Backbone.Router.extend({
    routes: {
      '*actions': 'defaultAction' // All urls will trigger this route
    }
  });

  var initialize = function(options){
		var appView = options.appView;
    var router = new AppRouter(options);

		router.on('route:defaultAction', function (actions) {
			require(['views/twitter/widget'], function (TwitterWidget) {
        var twitterWidget = Vm.create(appView, 'TwitterWidget', TwitterWidget);
        twitterWidget.render();
      });
		});
    
  };
  return {
    initialize: initialize
  };
});
