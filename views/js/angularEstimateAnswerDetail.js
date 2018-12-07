var app = angular.module('estimateanswerdetail', []);

// 화면 전환 시 login check 기능
app.controller('logincheckCtrl', function ($scope, $http, $window) {
  $scope.load = function () {
    $http.get('/logincheck').success(function (response) {
      console.log(response.RESULT);
      if (response.RESULT == "1") {
        $scope.div_login = {
          "width": "13%"
        };
        $scope.showHide_login = true;
      } else if (response.RESULT == "0") {
        var msg = "알수없는 오류로 로그인이 끊겼습니다.";
        $window.alert(msg);
        $window.location.href = '/login';
      } else {
        $scope.showHide_logout = true;
      }
    });
  };
});

//detail 컨트롤러
app.controller('estimateAnswerDetailCtrl', function ($scope, $http, $window) {
  var cookie = document.cookie.split("=");
  var click_idx = cookie[2];

  $http.get('/getestimateanswerdetail', {
    params: {
      answer_idx: click_idx
    }
  }).success(function (response) {
    if (response.RESULT == 1) {
      $scope.title = response.INFO.estimate_title;
      $scope.date = response.INFO.estimate_date;
      $scope.content = response.INFO.estimate_content;
      $scope.image = response.INFO.encodedimage;
    } else {
      var msg = "알 수 없는 에러로 detail 페이지를 불러 올 수 없습니다.";
      $window.alert(msg);
      $window.location.href = '/estimatelist';
    }
  }).error(function () {
    console.log("error");
  });
});