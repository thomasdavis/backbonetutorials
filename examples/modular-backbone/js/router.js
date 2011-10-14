// Filename: router.js
define([
  'jQuery',
  'Underscore',
  'Backbone',
  'views/projects/list',
  'views/users/list'
], function($, _, Backbone, projectListView, userListView){
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      '/projects': 'showProjects',
      '/users': 'showUsers',
      
      // Default
      '*actions': 'defaultAction'
    },
    showProjects: function(){
      // Call render on the module we loaded in via the dependency array
      // 'views/projects/list'
      projectListView.render();
    },
      // As above, call render on our loaded module
      // 'views/users/list'
    showUsers: function(){
      userListView.render();
    },
    defaultAction: function(actions){
      // We have no matching route, lets just log what the URL was
      $("#page").html('Homepage, we should implement a view for this');
    }
  });

  var initialize = function(){
    var app_router = new AppRouter;
    Backbone.history.start();
  };
  return { 
    initialize: initialize
  };
});
