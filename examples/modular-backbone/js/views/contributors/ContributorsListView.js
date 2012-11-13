define([
  'jquery',
  'underscore',
  'backbone',
  'collections/contributors/ContributorsCollection',
  'text!templates/contributors/contributorsListTemplate.html'
], function($, _, Backbone, ContributorsCollection, contributorListTemplate){
  
  var ContributorsListView = Backbone.View.extend({

    goldContributors : [],
    silverContributors : [],
    bronzeContributors : [],

    el : $("#contributors-list"),
    tagName:"ul",
    render : function() {

        var that = this; 

        var that = this;
        that.awardMedals(this.collection.models); 

        // hide the container list while adding contributors
        $('#contributors-list').hide();

        // there are 3 podiums for each group 
        var podium;

        var goldPodium = {
            baseHeight: '80px',
            achievement: 'Over 50 Contributions'
        }; 

        var silverPodium = {
           baseHeight: '60px',
           achievement: '5 - 50 Contributions'
        }

         var bronzePodium = {
           baseHeight: '40px',
           achievement: '1 - 5 Contributions'
        }


        var data = {
              contributors: that.goldContributors,
              _: _,
              podium : goldPodium 
            };

        // render gold list  
        data.contributors = that.goldContributors;
        data.podium = goldPodium;
        var compiledTemplate = _.template( contributorListTemplate, data );
        $("#gold-podium").html( compiledTemplate ); 
 
        // render silver list
        data.contributors = that.silverContributors;
        data.podium = silverPodium;
        var compiledTemplate = _.template( contributorListTemplate, data );
        $("#silver-podium").html( compiledTemplate ); 

        // render bronze list 
        data.contributors = that.bronzeContributors;
        data.podium = bronzePodium;
        var compiledTemplate = _.template( contributorListTemplate, data );
        $("#bronze-podium").html( compiledTemplate ); 

        that.animate();

        return this;
      }, 

      awardMedals : function(aModels) {

        var that = this; 

        var goldMedalHex = '#CFB52B';
        var silverMedalHex = '#E6E8FA';
        var bronzeMedalHex = '#A67D3D';
        var githubPath;
        var contributors;
        var count = 0;  

        _.each(aModels, function(contributor) {

            var contributions = Number ( contributor.get( 'contributions' ) );
            var medalHex; 
            var picWidth; 

            if ( contributions >= 50 ) {
              medalHex = goldMedalHex;
              picWidth = '160px';
              contributors = that.goldContributors; 
            } else if ( contributions < 50 && contributions >= 5) {
              medalHex = silverMedalHex;
              picWidth = '105px';
              contributors = that.silverContributors; 
            } else {
              medalHex = bronzeMedalHex;
              picWidth = '80px';
              contributors = that.bronzeContributors; 
            }

            githubPath = "https://github.com/" + contributor.get('login');

            contributor.set( 'medalHex', medalHex);
            contributor.set( 'picWidth', picWidth);
            contributor.set( 'githubPath', githubPath);
            contributor.set( 'name', 'contributor' + count ); 
            contributors.push(contributor);

            count++; 

        });
      },

      animate : function() {

        var that = this; 

        console.log("animating...");

        $("#gold-podium").hide();
        $("#silver-podium").hide();
        $("#bronze-podium").hide();


        // hide the container list while adding contributors
        $('#contributors-list').show();

        // animate in bronze
        $("#bronze-podium").find(".base").hide();
        $("#bronze-podium").find(".base").slideDown('slow').delay(0);

        _.each(that.bronzeContributors, function(contributor) {
          var hideId = '#' + contributor.get('name'); 

          $( hideId ).hide(); 
     
        });

        var bronzeDelayCount = 1000;
        var bronzeDelayInc = 200;
        _.each(that.bronzeContributors, function(contributor) {
            var animateId = '#' + contributor.get('name'); 

            $( animateId ).delay(bronzeDelayCount).slideDown('slow');
            bronzeDelayCount += bronzeDelayInc;
        });

        
        console.log(bronzeDelayCount);

        // animate in silver
        $("#silver-podium").find(".base").hide();
        $("#silver-podium").find(".base").slideDown('slow').delay(bronzeDelayCount);
        _.each(that.silverContributors, function(contributor) {
          var hideId = '#' + contributor.get('name'); 

          $( hideId ).hide(); 
     
        });

        var silverDelayCount = bronzeDelayCount;
        var silverDelayInc = 400;
        _.each(that.silverContributors, function(contributor) {
            var animateId = '#' + contributor.get('name'); 

            $( animateId ).delay(silverDelayCount).slideDown('slow');
            silverDelayCount += silverDelayInc;
        });

        // animate in gold 
        $("#gold-podium").find(".base").hide();
        $("#gold-podium").find(".base").slideDown('slow').delay(silverDelayCount);
        _.each(that.goldContributors, function(contributor) {
          var hideId = '#' + contributor.get('name'); 

          $( hideId ).hide(); 
     
        });

        var goldDelayCount = silverDelayCount;
        var goldDelayInc = 600;
        _.each(that.goldContributors, function(contributor) {
            var animateId = '#' + contributor.get('name'); 

            $( animateId ).delay(goldDelayCount).slideDown('slow');
            goldDelayCount += goldDelayInc;
        });

        $("#bronze-podium").show();
        $("#silver-podium").show();
        $("#gold-podium").show();

      }

  });

  return ContributorsListView;

});
