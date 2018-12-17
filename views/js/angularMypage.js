var app = angular.module('mypage', []);

app.controller('logincheckCtrl', function ($scope, $http, $window) {
  $scope.load = function () {
    $http.get('/logincheck').success(function (response) {
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
  $scope.logout = function () {
    $http.get('/logout').success(function (response) {
      console.log(response.RESULT);
      if (response.RESULT == "1") {
        var msg = "로그아웃되었습니다.";
        $window.alert(msg);
        $window.location.href = '/';
        $scope.showHide_logout = true;
      }
    }).error(function () {
      console.log(error);
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
      } else if (response.RESULT == "0") {
        var msg = "알 수 없는 에러";
        $window.alert(msg);
      } else if (response.RESULT == "2") {
        var msg = "비밀번호가 틀립니다.";
        $window.alert(msg);
        $window.location.href = '/';
      }
    })
  }
});

app.controller('userCtrl', function ($scope, $http, $window) {
  $scope.pushDataUserpicture = function () {
    var input = document.getElementById('fileselector');
    var fr = new FileReader();
    fr.readAsDataURL(input.files[0]);//input.files[0]에 사용자 로컬경로가 담기고 그게 fr에 저장
    fr.onload = function () {
      var str = fr.result.split(',')[1];
      var image = str;
      $http({
        method: 'PUT',
        url: '/editprofile',
        headers: {
          'Content-Type': 'application/json'
        },
        data: ({
          image: image
        })
      }).success(function (response) {
        if (response.RESULT == "1") {
          var msg = "회원정보수정에 성공하셨습니다.";
          $window.alert(msg);
          $window.location.href = '/mypagesetting';
        } else if (response.RESULT == "0") {
          var msg = "알 수 없는 오류로 변경에 실패하였습니다.";
          $window.alert(msg);
          $window.location.href = '/'
        }
      }).error(function () {
        console.log("error");
      });
    }
  }

  $scope.pushDataPassword = function () {
    $http({
      method: 'PUT',
      url: '/editpassword',
      headers: {
        'Content-Type': 'application/json'
      }, data: ({
        pw: $scope.pw
      })
    }).success(function (response) {
      if (response.RESULT == "1") {
        var msg = "회원정보수정에 성공하셨습니다.";
        $window.alert(msg);
        $window.location.href = '/mypagesetting';
      } else if (response.RESULT == "0") {
        var msg = "알 수 없는 오류로 변경에 실패하였습니다.";
        $window.alert(msg);
        $window.location.href = '/'
      }
    }).error(function () {
      console.log("error");
    });
  }

  // $scope.pushDataUserpicture = function () {
  //   var input = document.getElementById('fileselector');
  //   var fr = new FileReader();
  //   if (input.files[0]) {
  //     fr.readAsDataURL(input.files[0]);//input.files[0]에 사용자 로컬경로가 담기고 그게 fr에 저장
  //     fr.onload = function () {
  //       var str = fr.result.split(',')[1];
  //       var image = str;
  //       console.log(JSON.stringify(image));
  //       $http({
  //         method: 'POST',
  //         url: '/mypagesetting',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         data: ({
  //           nickname: $scope.nickname,
  //           pw: $scope.pw,
  //           image: image
  //         })
  //       }).success(function (response) {
  //         if (response.RESULT == "1") {
  //           var msg = "회원정보수정에 성공하셨습니다.";
  //           $window.alert(msg);
  //           $window.location.href = '/';
  //         } else if (response.RESULT == "4") {
  //           var msg = "알 수 없는 오류로 변경에 실패하였습니다.";
  //           $window.alert(msg);
  //           $window.location.href = '/'
  //         }
  //       }).error(function () {
  //         console.log("error");
  //       });
  //     }
  //   } else {
  //     $http({
  //       method: 'POST',
  //       url: '/mypagesetting',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       data: ({
  //         nickname: $scope.nickname,
  //         pw: $scope.pw,
  //         image: null
  //       })
  //     }).success(function (response) {
  //       if (response.RESULT == "1") {
  //         var msg = "회원정보수정에 성공하셨습니다.";
  //         $window.alert(msg);
  //         $window.location.href = '/';
  //       } else if (response.RESULT == "4") {
  //         var msg = "알 수 없는 오류로 변경에 실패하였습니다.";
  //         $window.alert(msg);
  //         $window.location.href = '/'
  //       }
  //     }).error(function () {
  //       console.log("error");
  //     });
  //   }
  // }

  $scope.cancelSetting = function () {
    var msg = "변경을 취소합니다.";
    $window.alert(msg);
    $window.location.href = '/';
  };
});

