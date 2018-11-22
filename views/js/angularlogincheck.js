var myApp = angular.module('myApp', []);

  myApp.controller('logincheckCtrl', function($scope, $http) {
    $http.get('/logincheck').success(function(response) {
      if (response.RESULT == "1") {
        $scope.showHide_login = !$scope.showHide_login;
        $scope.showHide_logout = !$scope.showHide_logout;
      } else {
        var msg = "알수없는 오류로 로그인이 끊겼습니다.";
        $window.alert(msg);
        $scope.showHide_login = false;
        $scope.showHide_logout = true;
      }
    });
  });
