function navdivResize() {
    var navdiv = document.getElementById('navdiv');
    navdiv.style.width = window.innerWidth - 200 + 'px';
}
function logoResize() {
    var logo = document.getElementsByClassName('nav-logo');
    logo.style.width = window.innerWidth - 1200 + 'px';
}
window.onload = function() {
  navdivResize();
  // 브라우저 크기가 변할 시 동적으로 사이즈를 조절해야 하는경우
  window.addEventListener('resize', navdivResize);
  window.addEventListener('resize', navdivResize);
};
