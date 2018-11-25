var app = angular.module('magazinedetail', []);

//우진이 네비바 로그인 체크
app.controller('logincheckCtrl', function($scope, $http, $window) {
  $scope.load = function() {
    $http.get('/logincheck').success(function(response) {
      console.log(response.RESULT);
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


app.controller('magazinetitle', function($scope, $http) {
  $scope.load = function() {
    $http.get('/getmagazinedetail', {
      params: {
        offset: offset
      }
    });
  };
});
