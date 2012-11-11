define([
  'underscore',
  'backbone',
  'models/contributor/ContributorModel'
], function(_, Backbone, ContributorModel){    
    
    var ContributorView = Backbone.View.extend({
        tagName : "li",
        render : function() {
            
           var contributor = { avatar_url : this.model.get("avatar_url"), 
                               login : this.model.get("login"), 
                               url : this.model.get("url"),
                               contributions: this.model.get("contributions")};
            
          //console.log("view created");
            
          /*
            var contributorTemplate = '<div class="contributor">' +
                            '<ul>' +
                                '<li>' +
                                '<img class="pic" width="100" src="<%= avatar_url %>">' +
                                '</li>' +
                                '<li>' +
                                    '<p class="blog"><a class="blogurl" href="<%= url %>"><%= login %></a></p>' +
                                '</li>' +
                                '<li>' +
                                    '<p class="contributions"><%= contributions %></p>' +
                                '</li>' +
                            '</ul>' + 
                        '</div>';
           
            //var contributorTemplate = $('#contributor-underscore-template').html(); hmmmmm???? 
                  
            var rendered_template = _.template(contributorTemplate, contributor);
            //console.log(rendered_template,contributor);
            
            $(this.el).append(rendered_template);
            */

            
            
           return this;
        }
        
    });

    return ContributorModel;

}); 