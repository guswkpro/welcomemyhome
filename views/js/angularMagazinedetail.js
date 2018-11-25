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
    })
  };
});


  $http.get('/getestimateanswerlist', {
    params: {
      offset: offset
    }
   }).success(function(response) {
          if (response.RESULT == 1) {
            data_my = response.INFO;
            console.log(data_my, "user1");
            total_my = 15; // response.total_my
            total = total_my;
          } else {
            var msg = "알 수 없는 에러로 리스트를 불러 올 수 없습니다.";
            $window.alert(msg);
            $window.location.href = '/';
          }
        else { //로그인 안 했을 시
        var msg = "로그인을 해주세요";
        $window.alert(msg);
        $window.location.href = '/';
      });
