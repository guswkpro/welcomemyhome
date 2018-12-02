var app = angular.module('communitydetail', []);

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
  });

  app.controller('communityDetailCtrl', function ($scope, $http, $window) {
    // var cookie_user = document.cookie.substring(0, 8).split("=");
    // var usercheck = cookie_user[1];
    console.log(document.cookie);
    var cookie = document.cookie.split("%2F")[1];
    var cookie_community_idx = decodeURI("84%2F0%2F_G2gJ6AEe-eHQ-XkWnQeoQpk2sgCKQXJ");
    console.log(cookie);
    console.log(cookie_community_idx);
  
    $http.get('/getcommunitydetail', {
      params: {
        estimate_idx: $scope.community_idx
      }
    }).success(function (response) {
      if (response.RESULT == 1) {
        $scope.data = response.INFO;
       // $scope.title = response.INFO.community_title;
       // $scope.date = response.INFO.community_post_date;
       // $scope.content = response.INFO.community_content;
       // $scope.image = response.INFO.encodedimage;
      } else {
        var msg = "알 수 없는 에러로 detail 페이지를 불러 올 수 없습니다.";
        $window.alert(msg);
        $window.location.href = '/community';
      }
    }).error(function () {
      console.log("error");
    });
  });