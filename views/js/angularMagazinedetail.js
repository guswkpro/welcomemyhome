var app = angular.module('magazinedetail', []);

app.controller('logincheckCtrl', function($scope, $http, $window) {
  $scope.load = function() {
    $http.get('/logincheck').success(function(response) {
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

app.controller('magazinedetailcard', function($scope, $http) {
  $scope.load = function(){
      
  }
  $scope.getmagazinedetail = function(idx) {
    $http.get('/getmagazinedetail', {
      params: {
        magazine_idx: idx
      }
    }).success(function(response) {
      if (response.RESULT == 1) {
        console.log(response, "success");

        $scope.magazinetitle = response.INFO.magazine_title;
        $scope.encodedimage = response.INFO.encodedimage;
        $scope.comment = response.INFO.magazine_comment_content;


      } else {
        console.log(response, "falt");
      }
    }).error(function() {
      console.log(error);
    });

    $http.get('/getmagazinecomment', {
      params: {
        magazine_idx: idx
      }
    });

  }
});

app.controller('magazinelist', function($scope, $http) {
  $http.get('/getmagazinedetail', {
    params: {
      offset: 0
    }
  }).success(function(response) {
    if (response.RESULT == 1) {
      console.log(response, "success");

			$scope.magazine_list = response.INFO

			console.log(response.INFO, $scope.magazine_list);
    } else {
      console.log(response, "falt");
    }
  }).error(function() {
    console.log(error);
  });
});
