var app = angular.module('preinspection', []);

app.controller('logincheckCtrl', function ($scope, $http, $window) {
    var cookie_auth = document.cookie.split("%2F");
    var auth = cookie_auth[1];
    $scope.load = function () {
        if (auth == 0) {
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
            })
        }
        else {
            var msg = "사전점검은 사용자만 가능합니다"
            $window.alert(msg);
            $window.location.href = '/';
        }
        
    };
});

app.controller('preinspectionCtrl', function ($scope, $http, $window) {
    var pin = {};
    var pin_arr = new Array();
    var cloneCount=0;
    $scope.elements = {
        누수 : false, 금 : false, 도벽 : false
    };

    $(function() {
        // pin img 복사 이동
        $('.pin-img').draggable({helper: "clone", cursorAt: { top: 0, left: 15 }});
        // drop 이벤트
        $('.pin-img').bind('dragstop', function(event, ui) {
            pin[cloneCount] = $(ui.helper).clone(); 
            $(this).after(pin[cloneCount].draggable());
            pin[cloneCount].attr("id", "pin"+cloneCount);
            pin[cloneCount].css({
                'z-index': '999'
            });
            $("#dialog").css({
                'display': 'block'
            });
            cloneCount++;
        });
        $(".close").click(function() {
            $("#dialog").css({
            'display': 'none'
            });
        });
        $("html").click(function(event) {
            if(event.target.id === "dialog") {
                $("#dialog").css({
                    'display': 'none'
                });
            }
        });
    });

    // modal에서 데이터 제출
    $scope.pushpreinspectionData = function() {
        $http({
            method: 'POST',
            url: '/addpreinspection',
            headers: {
              'Content-Type': 'application/json'
            },
            data: ({
              title: $scope.title,
              checkbox: $scope.elements,
              content: $scope.content,
            })
          }).success(function(response) {
            if (response.RESULT == "1") {
              var msg = "사전점검을 등록하셨습니다.";
              $window.alert(msg);
              $window.location.href = '/preinspection';
            } else {
              var msg = "알 수 없는 오류로 사전점검 등록에 실패하였습니다.";
              $window.alert(msg);
              $window.location.href='/estimatelist'
            }
          }).error(function() {
            console.log("error");
          });
    }

    // 도면 이미지 받아오기
    $http.get('/getpreinspectionblueprint', {
        params: {
            
        }
    }).success(function (response) {
        if (response.RESULT == 1) {
            $scope.image = response.INFO.encodedimage;
        } else {
            var msg = "알 수 없는 에러로 preinspection 페이지를 불러 올 수 없습니다.";
            $window.alert(msg);
            $window.location.href = '/';
        }
    }).error(function () {
        console.log("error");
    });
});