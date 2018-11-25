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

app.controller('magazinetitle', function($scope, $http) {
  $http.get('/getmagazinedetail', {
    params: {
      magazine_idx: 15,16,17
    }
  }).success(function(response) {
    if (response.RESULT == 1) {
      console.log(response, "success");


      $scope.magazinetitle = response.INFO.magazine_title;
			$scope.commentcount = response.INFO.magazine_comment_count;

    } else {
      console.log(response, "falt");
    }
  }).error(function() {
    console.log(error);
  });
});
