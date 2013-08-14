define([
  'jquery',
  'underscore',
  'backbone',
  'models/project/ProjectModel'
], function($, _, Backbone, ProjectModel){
  var ProjectsCollection = Backbone.Collection.extend({
    model: ProjectModel,
    
    initialize: function(){

      var project0 = new ProjectModel('Cross Domain', 'https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/examples/cross-domain'); 
      var project1 = new ProjectModel('Infinite Scroll', 'https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/examples/infinite-scroll'); 
      var project2 = new ProjectModel('Modular Backbone','https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/examples/modular-backbone'); 
      var project3 = new ProjectModel('Node MongoDB Mongoose Restify','https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/examples/nodejs-mongodb-mongoose-restify');
      var project4 = new ProjectModel('Todo App','https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/examples/todo-app');

      //this.add([project0, project1, project2, project3, project4]);

    }

  });
 
  return ProjectsCollection;
});
