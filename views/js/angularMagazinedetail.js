var app = angular.module('magazinedetail', []);

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

app.controller('magazinedetailcard', function ($scope, $http, $window) {
  var cookie = document.cookie.split("click_idx=");
  var temp_cookie = cookie[1].split("-");
  var click_idx = temp_cookie;
  $http.get('/getmagazinedetail', {
    params: {
      magazine_idx: click_idx
    }
  }).success(function (response) {
    if (response.RESULT == 1) {
      $scope.magazinedetail = response.INFO
      $scope.title = response.INFO.magazine_title;
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
    $http({
      method: 'POST',
      url: '/addmagazinelike',
      headers: {
        'Content-Type': 'application/json'
      },
      data: ({
        magazine_idx: click_idx
      })
    }).success(function (response) {
      if (response.RESULT == "1") {
        $(function() {
      
            $(this).toggleClass("heart-blast");
         
        }); 
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

  $scope.pushCommentData = function () {
    console.log($scope.content);
    $http({
      method: 'POST',
      url: '/addmagazinecomment',
      headers: {
        'Content-Type': 'application/json'
      },
      data: ({
        magazine_idx: click_idx,
        content: $scope.content
      })
    }).success(function (response) {
      if (response.RESULT == "1") {
        var msg = "댓글이 등록됐습니다.";
        $window.alert(msg);
        $window.location.href = '/magazines';
      } else if (response.RESULT == "0") {
        var msg = "알 수 없는 오류로 댓글 작성에 실패하였습니다.";
        $window.alert(msg);
        $window.location.href = '/magazines'
      }
    }).error(function () {
      console.log("error");
    });
  }

  $http.get('/getmagazinecomment', {
    params: {
      magazine_idx: click_idx
    }
  }).success(function (response) {
    console.log(response.RESULT + "resultresult");
    if (response.RESULT == 1) {
      $scope.comment = response.INFO;
      console.log(response + "000000000000000");
      if (response.INFO.user_profile_image == null) {
        $scope.userimg = "img/user_profile_default.JPG"
        console.log($scope.userimg + "aaaaaaaaaa");
      }
      else {
        $scope.userimg = "data:image/jpeg;base64," + response.INFO.user_profile_image;
        console.log(userimg + "bbbbbbbbbb");
      }
      console.log(response.INFO);
    } else {
      console.log(response, "fault");
    }
  }).error(function () {
    console.log(error);
  });
});