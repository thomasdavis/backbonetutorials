define([
  'jquery',
  'underscore',
  'backbone',
  'models/MessageModel',
  'text!templates/guestbook/guestbookFormTemplate.html'
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

      console.log("posting message from GuestbookForm")

      var messageModel = new MessageModel();
      
      messageModel.save( { message: $('.message').val() }, {
        
        success: function () {
          console.log("GuestbookForm succes " + messageModel.get('message') )
          
          that.trigger('postMessage');
        },
        error: function () {
          console.log("GuestbookForm error on save");
        }

      });
    }
  });

  return GuestbookForm;

});
