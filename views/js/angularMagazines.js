var app = angular.module('magazines', []);

app.controller('logincheckCtrl', function($scope, $http, $window) {
  $scope.load = function() {
    $http.get('/logincheck').success(function(response) {
      if (response.RESULT == "1") {
        $scope.div_login = {
          "width": "12%"
        };
        $scope.showHide_login = true;
      } else if (response.RESULT == "0") {
        var msg = "알수없는 오류로 로그인이 끊겼습니다.";
        $window.alert(msg);
        $window.location.href = '/';
      } else {
        $scope.showHide_logout = true;
      }
    });
  };
});

app.controller('magazinelist', function($scope, $http) {
  $http.get('/getmagazinelist', {
    params: {
      offset: 0
    }
  }).success(function(response) {
    if (response.RESULT == 1) {
      $scope.magazine_list = response.INFO
    } else {
      console.log(response, "falt");
    }
  }).error(function() {
    console.log(error);
  });
});
