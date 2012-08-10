define([
  'jquery',
  'underscore',
  'backbone',
  'vm',
  'text!templates/guestbook/template.html',
  'views/guestbook/form',
  'views/guestbook/list'
], function($, _, Backbone, Vm, guestbookTemplate, GuestbookFormView, GuestbookListView){
  var DashboardPage = Backbone.View.extend({
    el: '.page',
    render: function () {
      $(this.el).html(guestbookTemplate);
      
      // Create new Backbone views using the view manager (does some extra goodies);
      
      var guestbookFormView = Vm.create(this, 'GuestbookFormView', GuestbookFormView);
      guestbookFormView.render();
      
      
      
      var guestbookListView = Vm.create(this, 'GuestbookListView', GuestbookListView);
      guestbookListView.render();
      
      guestbookFormView.on('postMessage', function () {
        guestbookListView.render();
      });
      
    }
  });
  return DashboardPage;
});
