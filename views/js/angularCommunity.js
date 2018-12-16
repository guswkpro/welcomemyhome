var app = angular.module('community', ['ui.bootstrap']);

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

app.controller('communityListCtrl', function ($scope, $http) {

  var getcommunitylist = function(offset){

    alert(offset)
    
    $http.get('/getcommunitylist', {
      params: {
        offset: offset
      }
    }).success(function (response) {
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

  getcommunitylist(0);
  
  $scope.userClickCommunity = function (community_idx) {
    document.cookie = "click_idx=" + community_idx;
    $window.location.href = '/communitydetail';
  };

  $scope.$watch('currentPage', function(newPage){
    $scope.watchPage = newPage;

    getcommunitylist(newPage);

  });

  $scope.pageChanged = function(page) {
    $scope.callbackPage = page;
    $scope.watchPage = newPage;
  };

  $scope.setItemsPerPage = function (num) {
    $scope.itemsPerPage = num;
    $scope.currentPage = 1; //reset to first page
  }
});

app.controller('PaginationDemoCtrl', function ($scope, $http) {
  var offset = 0;

  console.log($scope.currentPage, "out of if")
  if($scope.currentPage){
    console.log($scope.currentPage, "in")
    offset = $scope.currentPage - 1;
  }
  $http.get('/getcommunitylist', {
    params: {
      offset: offset
    }
  }).success(function (response) {
    $scope.data = response.INFO;
    $scope.viewby = 5;
    $scope.totalItems = response.COUNT;
    console.log(response.COUNT+"전체페이지갯수");
    $scope.currentPage = 1;
    $scope.itemsPerPage = $scope.viewby;
    $scope.maxSize = 5; //Number of pager buttons to show

    // $scope.onPageClick = function (event, page) {
    //   $('#page-content').text('Page ' + page);
    //   paging(page);
    // }
    // for(var i = 0; i < ){

    // }
    // $scope.selectPage = function(page) {
    //   alert('hello');
    // }


  })
})