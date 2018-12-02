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

    $scope.addpin = function() {
        var plan = $('#plan');
        var o = $('#my_pin');

        var start_x, tart_y, dist_x, dist_y, image_x, image_y;
        var dragging = false;
        
        var clone_pin = $(o).clone(true).ppendTo(document.querySelector('#div_pin').css({
            'z-index': '999'
        });

        $(clone_pin).on('mousedown', function(e) {
            e.preventDefault();
            start_x = e.pageX;
            start_y = e.pageY;
            image_x = clone_pin.offset().left;
            image_y = clone_pin.offset().top;
            dist_x=dist_y=0;
            dragging = true;
            console.log("mousedown - start_cursur:", start_x, start_y, "/image place:", image_x, image_y);
            // start_x = e.pageX;
            // start_y = e.pageY;
            // image_x = $(o).offset().left;
            // image_y = $(o).offset().top;
            // dist_x=dist_y=0;
            // dragging = true;
            // console.log("mousedown - start_cursur:", start_x, start_y, "/image place:", image_x, image_y);
        }).on('mouseup', function(e) {
            dist_x = e.pageX - start_x;
            dist_y = e.pageY - start_y;
            clone_pin.offset({left: image_x + dist_x, top: image_y+ dist_y});
            dragging = false;
            console.log("mouseup - distance:", dist_x, dist_y, "/image place:", image_x, image_y);
            // dist_x = e.pageX - start_x;
            // dist_y = e.pageY - start_y;
            // $(o).offset({left: image_x + dist_x, top: image_y+ dist_y});
            // dragging = false;
            // console.log("mouseup - distance:", dist_x, dist_y, "/image place:", image_x, image_y);
        });

        $('html').on('mousemove', function(e) {
            if(dragging) {
                dist_x = e.pageX -start_x;
                dist_y = e.pageY -start_y;
                clone_pin.offset({left: image_x + dist_x, top: image_y + dist_y});
            }
            // if(dragging) {
            //     dist_x = e.pageX -start_x;
            //     dist_y = e.pageY -start_y;
            //     $(o).offset({left: image_x + dist_x, top: image_y + dist_y});
            //     $(plan).text(dist_x+","+dist_y);
            // }
        });
    };

    $http.get('/getpreinspection', {
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