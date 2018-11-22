var myApp = angular.module('myApp', []);

myApp.controller('logincheckCtrl', function($scope, $http, $window) {
  $http.get('/logincheck').success(function(response) {
    console.log(response.RESULT);
    if (response.RESULT == "1") {
      $scope.showHide_login = false;
    } else if (response.RESULT == "0") {
      var msg = "알수없는 오류로 로그인이 끊겼습니다.";
      $window.alert(msg);
      $window.location.href = '/';
    } else {
      $scope.showHide_logout = false;
    }
  });
});
