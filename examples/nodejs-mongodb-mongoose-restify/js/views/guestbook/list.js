define([
  'jquery',
  'underscore',
  'backbone',
  'collections/messages',
  'text!templates/guestbook/list.html'
], function($, _, Backbone, MessagesCollection, guestbookListTemplate){
  var GuestbookList = Backbone.View.extend({
    el: '.guestbook-list-container',
    render: function () {
      var that = this;
      var messages = new MessagesCollection();
      messages.fetch({
        success: function(messages) {
          $(that.el).html(_.template(guestbookListTemplate, {messages: messages.models, _:_}));
        }
      });
    }
  });
  return GuestbookList;
});
