define(['order!libs/jquery/jquery-min', 'order!libs/underscore/underscore-min', 'order!libs/backbone/backbone-min'],
function(){
  return {
    Backbone: Backbone.noConflict(),
    _: _.noConflict(),
    $: jQuery.noConflict()
  };
});
