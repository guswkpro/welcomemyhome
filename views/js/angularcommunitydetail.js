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
          var msg = "로그인 후 이용할 수 있습니다.";
          $window.alert(msg);
          $window.location.href = '/community';
          $scope.showHide_logout = true;
        }
      });
    };
  });

  app.controller('communityDetailCtrl', function ($scope, $http, $window) {
    var cookie = document.cookie.split("click_idx=");
    var temp_cookie = cookie[1].split("-");
    var click_idx = temp_cookie;
  
    $http.get('/getcommunitydetail', {
      params: {
        user_idx : $scope.user_idx,
        community_idx: click_idx
      }
    }).success(function (response) {
      if (response.RESULT == 1) {
        $scope.data = response.INFO;
        $scope.title = response.INFO.community_title;
        $scope.date = response.INFO.community_post_date;
        $scope.content = response.INFO.community_content;
        $scope.image = response.INFO.encodedimage;
      } else {
        var msg = "알 수 없는 에러로 페이지를 불러올 수 없습니다.";
        $window.alert(msg);
        $window.location.href = '/community';
      }
    }).error(function () {
      console.log("error");
    });

    $scope.pushCommentData = function () {
      console.log($scope.content);
      $http({
        method: 'POST',
        url: '/addcommunitycomment',
        headers: {
          'Content-Type': 'application/json'
        },
        data: ({
          community_idx: click_idx,
          content: $scope.addcomment
        })
      }).success(function (response) {
        if (response.RESULT == "1") {
          var msg = "댓글이 등록됐습니다.";
          $window.alert(msg);
          $window.location.href = '/community';
        } else if(response.RESULT == "0"){
          var msg = "알 수 없는 오류로 댓글 작성에 실패하였습니다.";
          $window.alert(msg);
          $window.location.href = '/community';
        }
      }).error(function () {
        console.log("error");
      });
    }

    $http.get('/getcommunitycomment', {
      params: {
        community_idx: click_idx
      }
    }).success(function (response) {
      if (response.RESULT == 1) {
        $scope.comment = response.INFO;
        console.log(JSON.stringify(response.INFO)+"겟커뮤니티댓글 반환값");
        console.log($scope.comment+"겟커뮤니티댓글 반환값");
      } else {
        var msg = "알 수 없는 에러로 댓글을 불러올 수 없습니다.";
        $window.alert(msg);
        $window.location.href = '/community';
      }
    }).error(function () {
      console.log("error");
    });

  });

  