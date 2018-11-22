var myApp = angular.module('myApp', []);

angular.element(document).ready(function() {
  myApp.controller('logincheckCtrl', function($scope, $http) {
    $http.get('/logincheck').success(function(response) {
      console.log(response.RESULT);
      if (response.RESULT == "1") {
        $scope.showHide_login = true;
        $scope.showHide_logout = false;
      } else {
        var msg = "알수없는 오류로 로그인이 끊겼습니다.";
        $window.alert(msg);
        $scope.showHide_login = false;
        $scope.showHide_logout = true;
      }
    });
  });
});
