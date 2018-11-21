$(document).ready(function() {
  var jbOffset = $('#navbar').offset();
  $(window).scroll(function() {
    if($(document).scrollTop() > jbOffset.top){
      $('#navbar').addClass('navFixed');
    }
    else {
      $('#navbar').removeClass('navFixed');
    }
  });
});
