define([
  'jquery',
  'underscore',
  'backbone',
  'collections/contributors/ContributorsCollection',
  'text!templates/contributors/contributorsListTemplate.html'
], function($, _, Backbone, ContributorsCollection, contributorListTemplate){
  
  var ContributorsListView = Backbone.View.extend({
    el : $("#contributors-list"),
    tagName:"ul",
    render : function() {

        var that = this;
        that.awardMedals(this.collection.models); 

        var data = {
              contributors: this.collection.models,
              _: _ 
            };

        var compiledTemplate = _.template( contributorListTemplate, data );
        $("#contributors-list").html( compiledTemplate ); 
 
        return this;
      }, 

      awardMedals : function(aModels) {
        var goldMedalHex = '#CFB52B';
        var silverMedalHex = '#E6E8FA';
        var bronzeMedalHex = '#A67D3D';
        var githubPath;

        _.each(aModels, function(contributor) {

            var contributions = Number ( contributor.get( 'contributions' ) );
            var medalHex; 
            var picWidth; 

            if ( contributions >= 50 ) {
              medalHex = goldMedalHex;
              picWidth = '160px';
            } else if ( contributions < 50 && contributions >= 5) {
              medalHex = silverMedalHex;
              picWidth = '120px';
            } else {
              medalHex = bronzeMedalHex;
              picWidth = '80px';
            }

            githubPath = "https://github.com/" + contributor.get('login');

            contributor.set( 'medalHex', medalHex);
            contributor.set( 'picWidth', picWidth);
            contributor.set( 'githubPath', githubPath);

        });
      }

  });

  return ContributorsListView;

});
