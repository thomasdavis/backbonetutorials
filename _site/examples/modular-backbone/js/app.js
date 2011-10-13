// Filename: app.js
define([
  'jQuery', 
  'Underscore', 
  'Backbone',
  'router', // Request router.js
], function($, _, Backbone, Router){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
    Router.initialize();
  }

  return { 
    initialize: initialize
  };
});
