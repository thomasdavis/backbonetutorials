define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/home/main.html'
], function($, _, Backbone, mainHomeTemplate){
  el: $("#page"),
  var mainHomeView = Backbone.View.extend({
    render: function(){
      this.el.html(mainHomeTemplate);
    }
  });
  return new mainHomeView;
});
