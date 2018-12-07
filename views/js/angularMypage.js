var app = angular.module('mypage', []);

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

  app.controller('passwordCheckCtrl', function ($scope, $http, $window) {
    $scope.clickLogin = function () {
      $http({
        method: 'POST',
        url: '/login',
        headers: {
          'Content-Type': 'application/json'
        },
        data: ({
          id: $scope.id, //필요없음
          pw: $scope.pw,
        })
      }).success(function (response) {
        console.log(response.RESULT);
        if (response.RESULT == "1") {
          $window.location.href = '/mypagesetting';
        } else if (response.RESULT == "2") {
          var msg = "존재하지 않는 아이디 입니다."; // 필요없음
          $window.alert(msg);
        } else if (response.RESULT == "3") {
          var msg = "비밀번호가 틀립니다.";
          $window.alert(msg);
          $window.location.href = '/';
        } else if (response.RESULT == "4") {
          var msg = "탈퇴한 회원입니다.";
          $window.alert(msg);
        }
      })
    }
  });


