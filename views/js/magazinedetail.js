
//좋아요 효과
$(function() {

  $(".heart").on("click", function() {
    $(this).toggleClass("heart-blast");
  });
});


//사진슬라이드쇼
$(document).ready(function(){
  var imgs;
  var img_count;
  var img_position = 1;

  imgs = $(".slide ul");
  img_count = imgs.children().length;

  //버튼클릭시 함수실행
  $('#back').click(function(){
    back();
  });
  $('#next').click(function(){
    next();
  });

  function back() {
    if(1<img_position){
      imgs.animate({
        left:'-=1000px'
      });
      imgs_position--;
    }
  }
  function next() {
    if(1<img_position){
      imgs.animate({
        left:'+=1000px'
      });
      imgs_position++;
    }
  }
});
