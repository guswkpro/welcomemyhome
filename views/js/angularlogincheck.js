var app = angular.module('Main', []);

// 화면 전환 시 login check 기능
app.controller('logincheckCtrl', function($scope, $http, $window) {
  $scope.load = function() {
    $http.get('/logincheck').success(function(response) {
      console.log(response.RESULT);
      if (response.RESULT == "1") {
        $scope.div_login = {
          "width" :  "12%"
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

// estimate 제출 시 정보 서버로 보내는 기능
app.controller('estimateCtrl', function($scope, $http, $window) {
  $scope.pushEstimateData = function () {
    $http({
      method: 'POST',
      url: '/addestimate',
      headers: {
        'Content-Type': 'application/json'
      },
      data: ({
        title: $scope.title,
        content: $scope.content,
        address: $scope.address,
      })
    }).success(function (response) {
      if (response.RESULT == "1") {
        console.log(response.RESULT);
        var msg = "견적 작성에 성공하셨습니다.";
        $window.alert(msg);
        $window.location.href = '/getestimatelist';
      } else {
        var msg = "알 수 없는 오류로 견적 작성에 실패하였습니다.";
        $window.alert(msg);
      }
    });
  };
});

// Estimate 작성 취소
app.controller('estimateCtrl', function($scope, $window) {
  $scope.cancelEstimate = function () {
    var msg = "작성을 취소하여 리스트 페이지로 이동합니다.";
    $window.alert(msg);
    $window.location.href = '/getestimatelist';
  };
});
