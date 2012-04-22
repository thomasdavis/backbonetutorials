define([
  'jquery',
  'underscore',
  'backbone',
  'models/message',
  'text!templates/guestbook/form.html'
], function($, _, Backbone, MessageModel, guestbookFormTemplate){
  var GuestbookForm = Backbone.View.extend({
    el: '.guestbook-form-container',
    render: function () {
      $(this.el).html(guestbookFormTemplate);
      
    },
    events: {
      'click .post-message': 'postMessage'
    },
    postMessage: function() {
      var that = this;

      var message = new MessageModel();
      message.save({ message: $('.message').val()}, {
        success: function () {
          that.trigger('postMessage');
        }
      });
    }
  });
  return GuestbookForm;
});
