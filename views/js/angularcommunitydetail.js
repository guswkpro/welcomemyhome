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

  $scope.pushCommentData = function () {
    let likecheck = 0;
    $http.get('/getcommunitydetail', {
      params: {
        community_idx: click_idx
      }
    }).success(function (response) {
      if (response.RESULT == 1) {
        $scope.communitydetail = response.INFO
        $scope.title = response.INFO.community_title;
        console.log(JSON.stringify(response.INFO) + "체크치크");
        console.log(response.INFO.likecheck + "좋아요체크치크");
        likecheck = response.INFO.likecheck;
        if (likecheck == 1) {
          $('.heart').toggleClass("heart-blast");
        }
        
        var tmp = [];
        for (var i = 0; i < response.INFO.encodedimage.length; i++) {
          tmp.push(i);
        }
        $scope.slideidx = tmp;
        document.cookie = "click_idx=";
      } else {
        console.log(response, "fault");
      }
    }).error(function () {
      console.log(error);
    });

  $scope.pushLike = function () {
    var method = null;
    var url = null;
    if (likecheck == 0) {
      method = 'POST';
      url = '/addcommunitylike';
    }
    else if (likecheck == 1) {
      method = 'DELETE'
      url = '/deletecommunitylike';
    }
    $http({
      method: method,
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: ({
        magazine_idx: click_idx
      })
    }).success(function (response) {
      if (response.RESULT == "1") {
        if (likecheck == 1) {
          console.log("여기입니당");
          $(".heart").removeClass("heart-blast")
          likecheck = 0;
        }
        else if (likecheck == 0) {
          $(".heart").toggleClass("heart-blast");
          likecheck = 1;
        }
      } else if (response.RESULT == "0") {
        var msg = "요청 실패";
        $window.alert(msg);
      };
    }).error(function () {
      var msg = "로그인이 필요합니다";
      $window.alert(msg);
      $window.location.href = '/login';
      console.log("error");
    })
  }

  $scope.pushtolist = function () {
    $window.location.href = '/community';
  }

  $http.get('/getcommunitycomment', {
    params: {
      community_idx: click_idx
    }
  }).success(function (response) {
    if (response.RESULT == 1) {
      $scope.comment = response.INFO;
      console.log(JSON.stringify(response.INFO) + "겟커뮤니티댓글 반환값");
    } else {
      var msg = "알 수 없는 에러로 댓글을 불러올 수 없습니다.";
      $window.alert(msg);
      $window.location.href = '/community';
    }
  }).error(function () {
    console.log("error");
  });
});

