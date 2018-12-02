var app = angular.module('preinspection', []);

app.controller('logincheckCtrl', function ($scope, $http, $window) {
    var cookie_auth = document.cookie.split("%2F");
    var auth = cookie_auth[1];
    $scope.load = function () {
        if (auth == 1) {
            var msg = "사전점검은 사용자만 가능합니다"
            $window.alert(msg);
            $window.location.href = '/';
        }
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

app.controller('preinspectionCtrl', function ($scope, $http, $window) {
    var pin = new Array();
    // pin img 복사 이동
    var cloneCount=1;

    $(function() {
        $('.pin-img').draggable({helper: "clone", cursorAt: { top: 0, left: 15 }});
        $('.pin-img').bind('dragstop', function(event, ui) {
            $(this).after($(ui.helper).clone()
                                        .draggable()
                                        .attr({
                                            id: "pin",
                                            data-toggle: "modal",
                                            data-target: "#pin_modal"
                                        });
                                        // .attr("data-toggle", "modal")
                                        // .attr("data-target", "#pin_modal");

            // pin[i].css({
            //     'z-index': '999'
            // });
            // $('#pin_modal').css({
            //     'display': 'block',
            // });
        });
        $('#pin_modal_close').css({
            'display': 'none'
        });
    });


    $http.get('/getpreinspection', {
        params: {
            pin_idx: pin[1]
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