var app = angular.module('magazines', []);

app.controller('logincheckCtrl', function ($scope, $http, $window) {
  $scope.load = function () {
    $http.get('/logincheck').success(function (response) {
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

app.controller('magazinelist', function ($scope, $http) {
  $http.get('/getmagazinelist', {
    params: {
      offset: "0"
    }
  }).success(function (response) {
    if (response.RESULT == 1) {
      $scope.magazine_list = response.INFO
      for (i = 0; i < $scope.magazine_list.length; i++) {
        var tmp = new Date($scope.magazine_list[i].magazine_post_date);
        var month = tmp.getMonth() + 1;
        var day = tmp.getDate();
        $scope.magazine_list[i].magazine_post_date = month + "-" + day;
      }
    } else {
      console.log(response, "falt");
    }
  }).error(function () {
    console.log(error);
  });
});

// 사용자가 게시글 클릭
$scope.userClickEstimate = function (magazine_idx) {
  document.cookie = "click_idx=" + magazine_idx;
  $window.location.href = '/magazinedetail';
};
