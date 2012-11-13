// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/home/HomeView',
  'views/projects/ProjectsView',
  'views/contributors/ContributorsView',
  'views/footer/FooterView'
], function($, _, Backbone, HomeView, ProjectsView, ContributorsView, FooterView) {
  
  var contributorsView;

  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'projects': 'showProjects',
      'users': 'showContributors',
      
      // Default
      '*actions': 'defaultAction'
    }
  });
  
  var initialize = function(){

    var app_router = new AppRouter;
    
    app_router.on('route:showProjects', function(){
   
        // Call render on the module we loaded in via the dependency array
        var projectsView = new ProjectsView();
        projectsView.render();

    });

    app_router.on('route:showContributors', function () {
    
        // there is a problem here -- when it draws the first everything is fine
        // but when it returns to this view, it adds the items to the list again
        // even though the collection has the same number of models
        // why won't it empty the divs?! I can do it in the console... 
        if ( String(contributorsView) !== "undefined" ) contributorsView.clearListView();

        // Like above, call render but know that this view has nested sub views which 
        // handle loading and displaying data from the GitHub API  
        contributorsView = new ContributorsView();
    });

    app_router.on('route:defaultAction', function (actions) {
     
       // We have no matching route, lets display the home page 
        var homeView = new HomeView();
        homeView.render();

         // unlike the above, we don't call render on this view
        // as it will handle the render call internally after it
        // loads data 
        var footerView = new FooterView();

    });

    Backbone.history.start();
  };
  return { 
    initialize: initialize
  };
});
