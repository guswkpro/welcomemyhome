var app = angular.module('estimateDetail', []);

// 화면 전환 시 login check 기능
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

//detail 컨트롤러
app.controller('estimateDetailCtrl', function ($scope, $http, $window) {
  //var cookie_user = document.cookie.substring(0, 8).split("=");
  // var usercheck = cookie_user[1];
  var cookie = document.cookie.split("=");
  var click_idx = cookie_user[2];
  console.log(document.cookie);
  console.log(click_idx , "click_idx");
  // var cookie = document.cookie.split("%2F")[1];
  // var cookie_estimate_idx = decodeURI("84%2F0%2F_G2gJ6AEe-eHQ-XkWnQeoQpk2sgCKQXJ");
  // console.log(cookie);
  // console.log(cookie_estimate_idx);

  // $http.get('/getestimatedetail', {
  //   params: {
  //     estimate_idx: "62"
  //   }
  // }).success(function (response) {
  //   if (response.RESULT == 1) {
  //     $scope.title = response.INFO.estimate_title;
  //     $scope.date = response.INFO.estimate_date;
  //     $scope.address = response.INFO.estimate_address;
  //     $scope.content = response.INFO.estimate_content;
  //     $scope.image = response.INFO.encodedimage;
  //   } else {
  //     var msg = "알 수 없는 에러로 detail 페이지를 불러 올 수 없습니다.";
  //     $window.alert(msg);
  //     $window.location.href = '/estimatelist';
  //   }
  // }).error(function () {
  //   console.log("error");
  // });
});

// Estimate list 출력
app.controller('estimateListCtrl', function ($scope, $http, $window, ) {
  $scope.currentPage = 1;
  $scope.pageSize = 5;  // var 써도 되지 않을까??
  // var cookie_user = document.cookie.substring(0, 8).split("=");
  // var usercheck = cookie_user[1];
  var offset = 0;
  var total;

  // 형이 고치면 getestimateanswerlist로 변경
  $http.get('/getestimatelist', {
    params: {
      offset: offset
    }
  }).success(function (response) {
    if (response.RESULT == 1) {
      $scope.data = response.INFO;
      total = 10; // response.total;
    } else {
      var msg = "알 수 없는 에러로 나의 견적 요청 리스트를 불러 올 수 없습니다.";
      $window.alert(msg);
      $window.location.href = '/';
    }
  });

  // 페이지 수 계산
  $scope.numberOfPages = function () {
    return Math.ceil(total / $scope.pageSize);
  };

  // 리스트 이전 값으로 갱신
  $scope.listPre = function () {
    $scope.currentPage = $scope.currentPage - 1;
    offset = ($scope.currentPage - 1) * 5;
    $http.get('/getestimatelist', {
      params: {
        offset: offset
      }
    }).success(function (response) {
      if (response.RESULT == 1) {
        $scope.data = response.INFO;
        total = 10; // response.total;
      } else {
        var msg = "알 수 없는 에러로 사용자 견적 리스트를 불러 올 수 없습니다.";
        $window.alert(msg);
        $window.location.href = '/';
      }
    });
  };

  // 리스트 다음 값으로 갱신
  $scope.listNext = function () {
    $scope.currentPage = $scope.currentPage + 1;
    offset = ($scope.currentPage + 1) * 5;
    $http.get('/getestimatelist', {
      params: {
        offset: offset
      }
    }).success(function (response) {
      if (response.RESULT == 1) {
        $scope.data = response.INFO;
        total = 10; // response.total;
      } else {
        var msg = "알 수 없는 에러로 사용자 견적 리스트를 불러 올 수 없습니다.";
        $window.alert(msg);
        $window.location.href = '/';
      }
    });
  }
});