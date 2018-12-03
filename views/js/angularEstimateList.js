var app = angular.module('estimateList', []);

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

  // Estimate list 출력
app.controller('estimateListCtrl', function($scope, $http, $window) {
    $scope.currentPage = 1;
    $scope.pageSize = 5;  // var 써도 되지 않을까??
    var auth = document.cookie.split("%2F")[1];
    var offset = 0;
    var total;
    var total_user;
    var total_my;
    var data_user;
    var data_my;
    var token_man = false;
    console.log(auth,"check");
    if(auth == 1) {
      $scope.hideAnswer = true;
      $scope.showAnswer = false;
      //$scope.hideAnswerButton = false;
    } else if(auth == 0 ){
      $scope.hideAnswer = false;
      $scope.showAnswer = true;
      //$scope.hideAnswerButton = true;
    }
  
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
          console.log(response.COUNT, "count");
          total = response.COUNT; // response.COUNT;
        } else {
          var msg = "알 수 없는 에러로 나의 견적 요청 리스트를 불러 올 수 없습니다.";
          $window.alert(msg);
          $window.location.href = '/';
        }
      });
    } else if (auth == "1") { // 사업자
      $scope.answercount = true;  // 사용자 글의 답변 갯수도 보이게 (e_a_c)
      // 전체 사용자 리스트 요청
      $http.get('/getestimatelist', {
        params: {
          offset: offset
        }
      }).success(function(response) {
        if (response.RESULT == 1) {
          data_user = response.INFO;
          $scope.data = data_user;
          total_user = response.COUNT; // data_user.total;
          total = total_user;
        } else {
          var msg = "알 수 없는 에러로 사용자 견적 리스트를 불러 올 수 없습니다.";
          $window.alert(msg);
          $window.location.href = '/';
        }
      });
      // 사업자 my 글 리스트 요청
      $http.get('/getestimatelist', { // 형이 구분 해줄 거임
        params: { 
          offset: offset
        }
      }).success(function(response) {
        if (response.RESULT == 1) {
          data_my = response.INFO;
          total_my = response.COUNT; // data_my.total
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
    $scope.viewMyWrite = function() { // 형이 구분해 주는 데이터를 띄우도록 변경해야함
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
        $http.get('/getestimatelist', {
          params: {
            offset: offset
          }
        }).success(function(response) {
          if (response.RESULT == 1) {
            $scope.data = response.INFO;
            total_my = response.COUNT; // response.total_my
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
            total_user = response.COUNT; // response.total_user;
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
        offset = ($scope.currentPage + 1) * 5;
        $http.get('/getestimatelist', {
          params: {
            offset: offset
          }
        }).success(function(response) {
          if (response.RESULT == 1) {
            $scope.data = response.INFO;
            total_my = response.COUNT; // response.total_my
            total = total_my;
          } else {
            var msg = "알 수 없는 에러로 답변 리스트를 불러 올 수 없습니다.";
            $window.alert(msg);
            $window.location.href = '/';
          }
        });
      } else if(token_man == 0){  // 사용자
        offset = ($scope.currentPage + 1) * 5;
        $http.get('/getestimatelist', {
          params: {
            offset: offset
          }
        }).success(function(response) {
          if (response.RESULT == 1) {
            $scope.data = response.INFO;
            total_user = response.COUNT; // response.total_user;
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
  