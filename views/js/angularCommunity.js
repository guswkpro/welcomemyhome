var app = angular.module('community', ['ui.bootstrap']);

app.controller('logincheckCtrl', function ($scope, $http, $window) {
  $scope.load = function () {
    $http.get('/logincheck').success(function (response) {
      console.log(response.RESULT);
      if (response.RESULT == "1") {
        $scope.div_login = {
          "width": "13%"
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

app.controller('communityListCtrl', function ($scope, $http) {

  var getcommunitylist = function (offset) {

    offset = (offset - 1) * 5;

    $http.get('/getcommunitylist', {
      params: {
        offset: offset
      }
    }).success(function (response) {

      $scope.data = response.INFO;
      $scope.viewby = 5;
      $scope.totalItems = response.COUNT;
      $scope.itemsPerPage = $scope.viewby;
      $scope.maxSize = 5
      if (response.RESULT == 1) {

        $scope.community_list = response.INFO
        for (i = 0; i < $scope.community_list.length; i++) {
          var tmp = new Date($scope.community_list[i].community_post_date);
          var month = tmp.getMonth() + 1;
          var day = tmp.getDate();
          $scope.community_list[i].community_post_date = month + "-" + day;
        }
        for (i = 0; i < $scope.community_list.length; i++) {
          var string = $scope.community_list[i].community_content;
          var str = string.substr(0, 20);
          $scope.community_list[i].community_content = str + "...";
        }
      } else {
        console.log(response, "fault");
      }
    }).error(function (error) {
      console.log(error);
    });
  }

  getcommunitylist(1);

  $scope.userClickCommunity = function (community_idx) {
    document.cookie = "click_idx=" + community_idx + "-";
    $window.location.href = '/community';
  };

  $scope.$watch('currentPage', function (newPage) {
    $scope.watchPage = newPage;

    if(typeof newPage !== 'number'){
      newPage = 1;
    }

    getcommunitylist((newPage));

  });

  $scope.pageChanged = function (page) {
    $scope.callbackPage = page;
    $scope.watchPage = newPage;
  };

  $scope.setItemsPerPage = function (num) {
    $scope.itemsPerPage = num;
    $scope.currentPage = 1; //reset to first page
  }
});