define([
  'jquery',
  'underscore',
  'backbone',
  'views/guestbook/GuestbookFormView',
  'views/guestbook/GuestbookListView',
  'text!templates/guestbook/guestbookTemplate.html'
], function($, _, Backbone, GuestbookFormView, GuestbookListView, guestbookTemplate){
  
  var CabinView = Backbone.View.extend({
    
    el: '.page',
    
    render: function () {
      
      $(this.el).html(guestbookTemplate);
      
      // Create new Backbone views using the view manager (does some extra goodies);
      var guestbookFormView = new GuestbookFormView();
      guestbookFormView.render();
      
      var guestbookListView = new GuestbookListView();
      guestbookListView.render();
      
      guestbookFormView.on('postMessage', function () {
        guestbookListView.render();
      });
      
    }
  });

  return CabinView;
  
});
