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
			require(['views/example/page'], function (ExamplePage) {
        var examplePage = Vm.create(appView, 'ExamplePage', ExamplePage);
        examplePage.render();
      });
		});
    
  };
  return {
    initialize: initialize
  };
});
