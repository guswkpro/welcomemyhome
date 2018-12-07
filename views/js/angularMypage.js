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
    $scope.clickPasswordCheck = function () {
      $http({
        method: 'POST',
        url: '/mypagepwcheck',
        headers: {
          'Content-Type': 'application/json'
        },
        data: ({
          pw: $scope.pw
        })
      }).success(function (response) {
        console.log(response.RESULT);
        if (response.RESULT == "1") {
          $window.location.href = '/mypageset';
        } else if (response.RESULT == "2") {
          var msg = "비밀번호를 입력해주세요."; 
          $window.alert(msg);
        } else if (response.RESULT == "3") {
          var msg = "비밀번호가 틀립니다.";
          $window.alert(msg);
          $window.location.href = '/';
        }
      })
    }
  });

  app.controller('userCtrl', function ($scope, $http, $window) {
    $scope.pushData = function() {
        var input = document.getElementById('fileselector');
        var fr = new FileReader();
        fr.readAsDataURL(input.files[0]);//input.files[0]에 사용자 로컬경로가 담기고 그게 fr에 저장
        fr.onload = function() {
          var str = fr.result.split(',')[1];
          var image = str;
            console.log(JSON.stringify(image));
            $http({
              method: 'POST',
              url: '/mypagesetting',
              headers: {
                'Content-Type': 'application/json'
              },
              data: ({
                nickname: $scope.nickname,
                pw: $scope.pw,
                image: image
              })
            }).success(function(response) {
              if (response.RESULT == "1") {
                var msg = "견적 작성에 성공하셨습니다.";
                $window.alert(msg);
                $window.location.href = '/estimatelist';
              } else {
                var msg = "알 수 없는 오류로 견적 작성에 실패하였습니다.";
                $window.alert(msg);
                $window.location.href='/estimatelist'
              }
            }).error(function() {
              console.log("error");
            });
        }
    }
    //estimate 작성 취소
    $scope.cancelEstimate = function() {
      var msg = "작성을 취소하여 리스트 페이지로 이동합니다.";
      $window.alert(msg);
      $window.location.href = '/estimatelist';
    };
    // $scope.clickLogin = function () {
    //   $http({
    //     method: 'POST',
    //     url: '/mypagesetting',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     data: ({

    //       nickname: $scope.nickname,
    //       pw: $scope.pw,
    //     })
    //   }).success(function (response) {
    //     console.log(response.RESULT);
    //     if (response.RESULT == "1") {
    //       $window.location.href = '/mypagesetting';
    //     } else if (response.RESULT == "2") {
    //       var msg = "존재하지 않는 아이디 입니다."; // 필요없음
    //       $window.alert(msg);
    //     } else if (response.RESULT == "3") {
    //       var msg = "비밀번호가 틀립니다.";
    //       $window.alert(msg);
    //       $window.location.href = '/';
    //     } else if (response.RESULT == "4") {
    //       var msg = "탈퇴한 회원입니다.";
    //       $window.alert(msg);
    //     }
    //   })
    // }
  });

