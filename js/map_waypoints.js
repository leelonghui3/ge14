$(document).ready(function() {

  $('#2018map-text').waypoint(function(direction) {
    if (direction === 'down') {
      $('#east_map_2013').addClass('hide-map');
      $('#east_map_2018').removeClass('hide-map');
    } else {
      $('#east_map_2018').addClass('hide-map');
      $('#east_map_2013').removeClass('hide-map');
    }
  }, {
    offset: '30%'
  });

});
