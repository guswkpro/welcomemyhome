var app = angular.module('estimateDetail', []);

// 화면 전환 시 login check 기능
app.controller('logincheckCtrl', function($scope, $http, $window) {
  $scope.load = function() {
    $http.get('/logincheck').success(function(response) {
      console.log(response.RESULT);
      if (response.RESULT == "1") {
        $scope.div_login = {
          "width": "13%"
        };
        $scope.showHide_login = true;
      } else if (response.RESULT == "2") {
        var msg = "알수없는 오류로 로그인이 끊겼습니다.";
        $window.alert(msg);
        $window.location.href = '/login';
        scope.showHide_logout = true;
      } else {
        var msg = "알수없는 오류가 발생하여 메인페이지로 이동합니다.";
        $window.alert(msg);
        $window.location.href = '/';
        $scope.showHide_logout = true;
      }
    });
  };
});

//detail 컨트롤러
app.controller('estimateDetailCtrl', function ($scope, $http, $window) {
  var cookie = document.cookie.split("=");
  console.log(document.cookie, "cookie detail");
  var temp_cookie = cookie.split(";");
  var click_idx = temp_cookie.cookie[0];
  console.log(click_idx, "detail idx")
  $http.get('/getestimatedetail', {
    params: {
      estimate_idx: click_idx
    }
  }).success(function (response) {
    if (response.RESULT == 1) {
      $scope.title = response.INFO.estimate_title;
      $scope.date = response.INFO.estimate_date;
      $scope.address = response.INFO.estimate_address;
      $scope.content = response.INFO.estimate_content;
      $scope.image = response.INFO.encodedimage;
    } else {
      var msg = "알 수 없는 에러로 detail 페이지를 불러 올 수 없습니다.";
      $window.alert(msg);
      $window.location.href = '/estimatelist';
    }
  }).error(function () {
    console.log("error");
  });
  $scope.addAnswer = function () {
    document.cookie = "click_idx=" + click_idx;
    console.log(document.cookie);
    $window.location.href = '/estimateanswer';
  };
});

// Estimate list 출력
app.controller('estimateListCtrl', function ($scope, $http, $window, ) {
  var cookie = document.cookie.split("=");
  var temp_cookie = cookie.split(";");
  console.log(cookie, "cookie list");
  var click_idx = temp_cookie.cookie[0];
  console.log(click_idx, "click_idx");
  $scope.currentPage = 1;
  $scope.pageSize = 5;  // var 써도 되지 않을까??
  var offset = 0;
  var total;

  // 형이 고치면 getestimateanswerlist로 변경
  $http.get('/getestimateanswerlist', {
    params: {
      estimate_idx : click_idx,
      offset: offset
    }
  }).success(function (response) {
    if (response.RESULT == 1) {
      $scope.data = response.INFO;
      total = response.COUNT;
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