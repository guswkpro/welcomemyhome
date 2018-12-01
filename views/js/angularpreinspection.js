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
    $window.dragStart = function(ev) {
        ev.dataTransfer.effectAllowed = 'move';
        ev.dataTransfer.setData("Image", ev.target.getAttribute('id'));
        ev.dataTransfer.dropEffect = "copyMove";
        ev.dataTransfer.setDragImage(ev.target,0,0);  
        var pin = angular.element("#dragged_img");
        var pin_left = pin.offset().left;
        var pin_top = pin.offset().top;
         console.log(pin_top, "pin.top", pin_left, "pin.left");
    }

    $window.dragEnter = function(ev) {
    }

    $window.dragOver = function(ev) {
        ev.dataTransfer.dropEffect = "copyMove";
        console.log(ev.pageX, ev.pageY);
    }

    $window.drop =function(ev) {
        var data = ev.dataTransfer.getData("text");
        $('#div-pin').css("left", ev.pageX-30+"px").css("top", ev.pageY-40+"px");
        console.log(ev.pageX, ev.pageY, "drop");
        // var pin = angular.element("#dragged_img");
        // console.log(pin.offset().top,"pin.top");
        // pin.offset({top: pin.offset().top, left: pin.offset().left})
        // ev.target.appendchild(document.getElementById(data));
    }

    $window.dragEnd = function(ev) {
        console.log(ev.pageX, ev.pageY, "drag");
        $('#div-pin').css("left", ev.pageX-78.828125+"px").css("top", ev.pageY-69.5+"px");
        var pin = angular.element("#dragged_img");
        var pin_left = pin.offset().left;
        var pin_top = pin.offset().top;
         console.log(pin_top, "pin.top", pin_left, "pin.left");
        /*
        // pin.offset({top: pin.offset().top, left:pin.offset().left});
        $scope.pin_style = {
            "position" : "absolute",
            "left": pin_left,
            "top": pin_top,
            "z-index" : "3",
            "margin" : "0",
            "display" : "block"
        };

        */

    }

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