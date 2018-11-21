var hasCookie, hasSession;
var login = $("#login_button");
var signup = $("#signup_button");

(function() {
    checkLogin(60000); // 1000 밀리세컨드 = 1초

    function checkLogin(delay) {
        setTimeout(function() {
          var loginCookie = document.cookie.indexOf("myLogin");
          if ((loginCookie > 0) && (typeof loginCookie === "number"))
            hasCookie = true;

          if (document.getElementById("logout") !== null)
            hasSession = true;

          if (hasCookie && hasSession) { // 둘다 존재
            login.hide();
            signup.hide();
          }
          else {
            if(hasCookie || hasSession){
              login.show();
              signup.show();
              location.replace('login.html');
            }
            else {
              login.show();
              signup.show();
              location.replace('main.html');
              return false;
            }
          }
          checkLogin(60000); // 재귀함수를 사용하여 반복수행함
      }, delay);
  }
})();
