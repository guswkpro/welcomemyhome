var app = angular.module('Main', []);

// 화면 전환 시 login check 기능
app.controller('logincheckCtrl', function($scope, $http, $window) {
  $scope.load = function() {
    $http.get('/logincheck').success(function(response) {
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

// estimate 제출 시 정보 서버로 보내는 기능
app.controller('estimateCtrl', function($scope, $http, $window) {
  $scope.pushEstimateData = function() {
    var images = [];

    var recourcive = function(index) {
      var input = document.getElementById('fileselector');
      let fr = new FileReader();
      fr.readAsDataURL(input.files[index]);
      fr.onload = function() {
        let str = fr.result.split(',')[1];
        let image = {
          image: str
        };
        images.push(image);
        if (index == input.files.length - 1) {
          console.log(JSON.stringify(images));
          $http({
            method: 'POST',
            url: '/addestimate',
            headers: {
              'Content-Type': 'application/json'
            },
            data: ({
              title: $scope.title,
              address: $scope.address,
              content: $scope.content,
              image: images
            })
          }).success(function(response) {
            if (response.RESULT == "1") {
              var msg = "견적 작성에 성공하셨습니다.";
              $window.alert(msg);
              $window.location.href = '/estimatelist';
            } else {
              var msg = "알 수 없는 오류로 견적 작성에 실패하였습니다.";
              $window.alert(msg);
            }
          }).error(function() {
            console.log("error");
          });
        } else {
          recourcive(index + 1);
        }
      }
    }
    recourcive(0);
  }
  //estimate 작성 취소
  $scope.cancelEstimate = function() {
    var msg = "작성을 취소하여 리스트 페이지로 이동합니다.";
    $window.alert(msg);
    $window.location.href = '/estimatelist';
  };
});

// Estimate answer 작성 취소
app.controller('estimateAnswerCtrl', function($scope, $window) {
  $scope.cancelEstimateAnswer = function() {
    var msg = "작성을 취소하여 리스트 페이지로 이동합니다.";
    $window.alert(msg);
    $window.location.href = '/estimatelist';
  };
});

// Estimate list 출력
app.controller('estimateListCtrl', function($scope, $http, $window) {
  $scope.currentPage = 1;
  $scope.pageSize = 5;
  var cookie_auth = document.cookie.split("%2F");
  // var cookie_user = document.cookie.substring(0, 8).split("=");
  var auth = cookie_auth[1];
  // var usercheck = cookie_user[1];
  var offset = 0;
  var total;
  var total_user;
  var total_my;
  var data_user;
  var data_my;
  var token_man = false;
  // auth(사용자, 사업자)에 따른 list 변화
  if (auth == "0") { // 사용자
    $scope.HideUser = true;
    $http.get('/getestimatelist', {
      params: {
        offset: offset
      }
    }).success(function(response) {
      if (response.RESULT == 1) {
        $scope.data = response.INFO;
        total = 10; // response.total;
      } else {
        var msg = "알 수 없는 에러로 나의 견적 요청 리스트를 불러 올 수 없습니다.";
        $window.alert(msg);
        $window.location.href = '/';
      }
    });
  } else if (auth == "1") { // 사업자
    $scope.answercount = true;
    // 전체 사용자 리스트 요청
    $http.get('/getestimatelist', {
      params: {
        offset: offset
      }
    }).success(function(response) {
      if (response.RESULT == 1) {
        data_user = response.INFO;
        $scope.data = data_user;
        total_user = 10; // response.total_user;
        total = total_user;
      } else {
        var msg = "알 수 없는 에러로 사용자 견적 리스트를 불러 올 수 없습니다.";
        $window.alert(msg);
        $window.location.href = '/';
      }
    });
    // 사업자 my 글 리스트 요청
    $http.get('/getestimateanswerlist', {
      params: {
        offset: offset
      }
    }).success(function(response) {
      if (response.RESULT == 1) {
        data_my = response.INFO;
        total_my = 15; // response.total_my
        total = total_my;
      } else {
        var msg = "알 수 없는 에러로 답변 리스트를 불러 올 수 없습니다.";
        $window.alert(msg);
        $window.location.href = '/';
      }
    });
  } else { //로그인 안 했을 시
    var msg = "User 정보가 명확치 않습니다. 로그인을 해주세요";
    $window.alert(msg);
    $window.location.href = '/';
  }

  // 페이지 수 계산
  $scope.numberOfPages = function() {
    return Math.ceil(total / $scope.pageSize);
  };

  // 사용자 글 보기로 바꾸기
  $scope.viewUserWrite = function() {
    token_man = false;
    $scope.currentPage = 1;
    $scope.data = data_user;
    total = total_user;
  };

  // 사업자가 쓴 답변 보기로 바꾸기
  $scope.viewMyWrite = function() {
    token_man = true;
    $scope.currentPage = 1;
    $scope.data = data_my;
    total = total_my;
  };

  // 리스트 이전 값으로 갱신
  $scope.listPre = function(){
    $scope.currentPage = $scope.currentPage - 1;
    if(token_man == 1){ // 사업자
      offset = ($scope.currentPage - 1) * 5;
      $http.get('/getestimateanswerlist', {
        params: {
          offset: offset
        }
      }).success(function(response) {
        if (response.RESULT == 1) {
          $scope.data = response.INFO;
          total_my = 15; // response.total_my
          total = total_my;
        } else {
          var msg = "알 수 없는 에러로 답변 리스트를 불러 올 수 없습니다.";
          $window.alert(msg);
          $window.location.href = '/';
        }
      });
    } else if(token_man == 0){  // 사용자
      offset = ($scope.currentPage - 1) * 5;
      $http.get('/getestimatelist', {
        params: {
          offset: offset
        }
      }).success(function(response) {
        if (response.RESULT == 1) {
          $scope.data=response.INFO;
          total_user = 10; // response.total_user;
          total = total_user;
        } else {
          var msg = "알 수 없는 에러로 사용자 견적 리스트를 불러 올 수 없습니다.";
          $window.alert(msg);
          $window.location.href = '/';
        }
      });
    }
  };

  // 리스트 다음 값으로 갱신
  $scope.listNext = function(){
    $scope.currentPage = $scope.currentPage + 1;
    if(token_man == 1){ // 사업자
      offset = ($scope.currentPage - 1) * 5;
      $http.get('/getestimateanswerlist', {
        params: {
          offset: offset
        }
      }).success(function(response) {
        if (response.RESULT == 1) {
          $scope.data = response.INFO;
          total_my = 15; // response.total_my
          total = total_my;
        } else {
          var msg = "알 수 없는 에러로 답변 리스트를 불러 올 수 없습니다.";
          $window.alert(msg);
          $window.location.href = '/';
        }
      });
    } else if(token_man == 0){  // 사용자
      offset = ($scope.currentPage - 1) * 5;
      $http.get('/getestimatelist', {
        params: {
          offset: offset
        }
      }).success(function(response) {
        if (response.RESULT == 1) {
          $scope.data = response.INFO;
          total_user = 10; // response.total_user;
          total = total_user;
        } else {
          var msg = "알 수 없는 에러로 사용자 견적 리스트를 불러 올 수 없습니다.";
          $window.alert(msg);
          $window.location.href = '/';
        }
      });
    }
  };

  // 사용자가 자기 게시글 클릭
  $scope.userClickEstimate = function() {
    $window.location.href = "/estimatedetail";
  };
});


//detail 컨트롤러
app.controller('estimatedetailCtrl', function($scope, $http, $window) {
  var cookie_auth = document.cookie.split("%2F");
  // var cookie_user = document.cookie.substring(0, 8).split("=");
  var auth = cookie_auth[1];
  // var usercheck = cookie_user[1];
  if(auth == 1){  //사업자
    var hideAnswer = true;
  }
  $http.get('/getestimatedetail', {
    params: {
      estimate_idx: "57"
    }
  }).success(function(response) {
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
  }).error(function() {
    console.log("error");
  });
});
