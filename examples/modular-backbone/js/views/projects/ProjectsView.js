define([
  'jquery',
  'underscore',
  'backbone',
  'views/sidebar/SidebarView',
  'models/project/ProjectModel',
  'collections/projects/ProjectsCollection',
  'views/projects/ProjectsListView',
  'text!templates/projects/projectsTemplate.html'
], function($, _, Backbone, SidebarView, ProjectModel, ProjectsCollection, ProjectsListView, projectsTemplate){

  var ProjectsView = Backbone.View.extend({
    el: $("#page"),
    render: function(){
      $('.menu li').removeClass('active');
      $('.menu li a[href="'+window.location.hash+'"]').parent().addClass('active');
      this.$el.html(projectsTemplate);

      var project0 = new ProjectModel({title: 'Cross Domain', url: 'https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/examples/cross-domain'}); 
      var project1 = new ProjectModel({title:'Infinite Scroll', url: 'https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/examples/infinite-scroll'}); 
      var project2 = new ProjectModel({title:'Modular Backbone', url: 'https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/examples/modular-backbone'}); 
      var project3 = new ProjectModel({title:'Node MongoDB Mongoose Restify', url: 'https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/examples/nodejs-mongodb-mongoose-restify'});
      var project4 = new ProjectModel({title:'Todo App', url: 'https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/examples/todo-app'});

      var aProjects = [project0, 
                      project1,
                      project2,
                      project3,
                      project4];

      var projectsCollection = new ProjectsCollection(aProjects);  
      var projectsListView = new ProjectsListView({ collection: projectsCollection}); 
      
      projectsListView.render(); 

      // add the sidebar 
      var sidebarView = new SidebarView();
      sidebarView.render();

    }
  });

  return ProjectsView;
});
