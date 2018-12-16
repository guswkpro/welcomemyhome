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
    $scope.logout = function() {
      $http.get('/logout').success(function(response) {
        console.log(response.RESULT);
        if (response.RESULT == "1") {
          var msg = "로그아웃되었습니다.";
          $window.alert(msg);
          $window.location.href = '/';
          $scope.showHide_logout = true;
        }
      }).error(function(){
        console.log(error);
      });
    };
  });

  app.controller('communityDetailCtrl', function ($scope, $http, $window) {
    var cookie = document.cookie.split("click_idx=");
    console.log(document.cookie + "          aaaaaaaaaaaaaa");
    var temp_cookie = cookie[1].split("-")[0];
    var click_idx = temp_cookie;
    let likecheck = 0;
    $http.get('/getcommunitydetail', {
      params: {
        user_idx : $scope.user_idx,
        community_idx: click_idx
      }
    }).success(function (response) {
      if (response.RESULT == 1) {
        $scope.data = response.INFO;
        console.log(JSON.stringify(response.INFO)+"디테일 반환값");
        $scope.title = response.INFO.community_title;
        $scope.date = response.INFO.community_post_date;
        $scope.content = response.INFO.community_content;
        $scope.image = response.INFO.encodedimage;
        $scope.userimage = response.INFO.encodedimage;
        likecheck = response.INFO.likecheck;
      if (likecheck == 1) {
        $('.heart').toggleClass("heart-blast");
      }
      document.cookie = "click_idx=";
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

    $scope.pushLike = function () {
      var method = null;
      var url = null;
      if (likecheck == 0) {
        method = 'POST';
        url = '/addcommunitylike';
      }
      else if(likecheck == 1) {
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
          community_idx: click_idx
        })
      }).success(function (response) {
        if (response.RESULT == "1") {
          if (likecheck == 1){
            console.log("여기입니당");
            $(".heart").removeClass("heart-blast")
            likecheck = 0;
          }
          else if(likecheck == 0) {
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
      });
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
        console.log(JSON.stringify(response.INFO)+"겟커뮤니티댓글 반환값");
        
      } else {
        var msg = "알 수 없는 에러로 댓글을 불러올 수 없습니다.";
        $window.alert(msg);
        $window.location.href = '/community';
      }
    }).error(function () {
      console.log("error");
    });

  });

  