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
                        "width": "13%"
                    };
                    $scope.showHide_login = true;
                } else if (response.RESULT == "2") {
                    var msg = "사전점검은 로그인후에 이용가능합니다.";
                    $window.alert(msg);
                    $window.location.href = '/login';
                } else {
                    var msg = "알수없는 오류가 발생하여 메인페이지로 이동합니다.";
                    $window.alert(msg);
                    $window.location.href = '/';
                    $scope.showHide_logout = true;
                }
            })
        }
        else if (auth == 1) {
            var msg = "사전점검은 사용자만 가능합니다"
            $window.alert(msg);
            $window.location.href = '/';
        }
        else {
            var msg = "사전점검은 로그인후에 이용가능합니다.";
            $window.alert(msg);
            $window.location.href = '/login';
        }
    };
});

app.controller('preinspectionCtrl', function ($scope, $http, $window) {
    var pin_img = new Array();
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
            var pin_info = {
                id: null,
                x: null,
                y: null
            }
            pin_img[cloneCount] = $(ui.helper).clone(); 
            $(this).after(pin_img[cloneCount].draggable());
            pin_img[cloneCount].attr("id", "pin"+cloneCount);
            pin_info.x = pin_img[cloneCount].offset().left;
            pin_info.y = pin_img[cloneCount].offset().top;
            pin_info.id = cloneCount;
            console.log(pin_info, "pin_info");
            pin_img[cloneCount].css({
                'z-index': '5'
            });
            $("#dialog").css({
                'display': 'block'
            });
            pin_arr[cloneCount] = pin_info;
            console.log(pin_arr, "pin_arr");
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
        //pin 클릭시 모듈 정보 다시 띄우기
        $(".pin-img").click(function() {
            $http.get('/getpreinspectionmodule', {
                params: {
                    pin_idx : $(this).attr("id")
                }
            }).success(function(response) {
                if(response.RESULT == "1") {
                    $scope.title = response.INFO.title;
                    $scope.content = response.INFO.content;
                }
            })
        })
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
    $http.get('/getpreinspectionblueprint').success(function (response) {
        if (response.RESULT == 1) {
            console.log(response.INFO);
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