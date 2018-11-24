var app = angular.module('Main', []);

app.factory('getuserauth', function($http) {
  var userauth = "1";

  return $http.get('/logincheck').success(function(response) {
    console.log("2");
    console.log(response);
    userauth = response.auth;
    console.log("3");
    console.log(userauth);
    return userauth;
  }).error(function(response) {
    console.log("실패함");
  });
});

// 화면 전환 시 login check 기능
app.controller('logincheckCtrl', function($scope, $http, $window) {
  $scope.load = function() {
    $http.get('/logincheck').success(function(response) {
      console.log(response.RESULT);
      if (response.RESULT == "1") {
        auth = response.auth;
        console.log(auth+"auth");
        console.log(response.auth+"respnse");
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

// estimate 제출 시 정보 서버로 보내는 기능
app.controller('estimateCtrl', function($scope, $http, $window) {
  $scope.pushEstimateData = function() {
    $http({
      method: 'POST',
      url: '/addestimate',
      headers: {
        'Content-Type': 'application/json'
      },
      data: ({
        title: $scope.title,
        content: $scope.content,
        address: $scope.address,
        picture: $scope.picture
      })
    }).success(function(response) {
      if (response.RESULT == "1") {
        console.log(response.RESULT);
        var msg = "견적 작성에 성공하셨습니다.";
        $window.alert(msg);
        $window.location.href = '/estimatelist';
      } else {
        var msg = "알 수 없는 오류로 견적 작성에 실패하였습니다.";
        $window.alert(msg);
      }
    });
  };
});

// Estimate 작성 취소
app.controller('estimateCtrl', function($scope, $window) {
  $scope.cancelEstimate = function() {
    var msg = "작성을 취소하여 리스트 페이지로 이동합니다.";
    $window.alert(msg);
    $window.location.href = '/estimatelist';
  };
});

// Estimate answet 작성 취소
app.controller('estimateAnswerCtrl', function($scope, $window) {
  $scope.cancelEstimateAnswer = function() {
    var msg = "작성을 취소하여 리스트 페이지로 이동합니다.";
    $window.alert(msg);
    $window.location.href = '/estimatelist';
  };
});


// Estimate list 출력
app.controller('estimateListCtrl', function($scope, $http, $window) {
  console.log(document.cookie);
  var cookie = document.cookie.split("/");
  var auth = cookie[1];
  console.log(auth + "auth");
  // auth(사용자, 사업자)에 따른 list 변화
  if (getuserauth == "0") { // 사용자
    $http.get('/getestimatelist', {
      params: {
        user_idx: 77,
        offset: 0
      }
    }).success(function(response) {
      if (response.RESULT == 1) {
        $scope.data = response.INFO;
      } else {
        var msg = "알 수 없는 에러로 리스트를 불러 올 수 없습니다.";
        $window.alert(msg);
        $window.location.href = '/';
      }
    });
  } else if (auth == "1") { // 사업자
    $scope.answercount = true;
    $http.get('/getestimateanswerlist', {
      params: {
        user_idx: 77,
        offset: 0
      }
    }).success(function(response) {
      if (response.RESULT == 1) {
        $scope.data = response.INFO;
        console.log(response);
      } else {
        var msg = "알 수 없는 에러로 리스트를 불러 올 수 없습니다.";
        $window.alert(msg);
        $window.location.href = '/';
      }
    });
  } else { //로그인 안 했을 시
    var msg = "User 정보가 명확치 않습니다. 로그인을 해주세요";
    console.log("aaaa" + getuserauth);
    $window.alert(msg);
    $window.location.href = '/';
  }
  $scope.currentPage = 1;
  $scope.pageSize = 5;
  $scope.numberOfPages = function() {
    return Math.ceil($scope.data.length / $scope.pageSize);
  };
});
