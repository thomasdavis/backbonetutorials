define([
  'jquery',
  'underscore',
  'backbone',
  'vm',
  'collections/twitter',
  'text!templates/twitter/list.html'
], function($, _, Backbone, Vm, TwitterCollection, TwitterListTemplate){
  var DashboardPage = Backbone.View.extend({
    el: '.page',
    render: function () {
      $(this.el).html('');
      this.isLoading = false;
      this.twitterCollection = new TwitterCollection();
      this.loadResults();
      
    },
    loadResults: function () {
      var that = this;
      this.isLoading = true;
      this.twitterCollection.fetch({ 
        success: function (tweets) {
          $(that.el).append(_.template(TwitterListTemplate, {tweets: tweets.models, _:_}));
          that.isLoading = false;
        }
      });      
    },
    events: {
      'scroll': 'checkScroll'
    },
    checkScroll: function () {
      var triggerPoint = 100; // 100px from the bottom
        if( !this.isLoading && this.el.scrollTop + this.el.clientHeight + triggerPoint > this.el.scrollHeight ) {
          this.twitterCollection.page += 1; // Load next page
          this.loadResults();
        }
    }
  });
  return DashboardPage;
});
