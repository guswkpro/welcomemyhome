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

    $(function() {
        var debug = $('#debug');
        var o = $('#my_ball');
        var sx, sy, dx, dy, ix, iy;
        var dragging = false;
        $('#my_ball').on('mousedown', function(e) {
            e.preventDefault();
            sx = e.pageX;
            sy = e.pageY;
            ix = $(o).offset().left;
            iy = $(o).offset().top;
            dx=dy=0;
            dragging = true;
            console.log("mousedown - s:", sx, sy, "/i:", ix, iy);
        }).on('mouseup', function(e) {
            dx = e.pageX - sx-;
            dy = e.pageY - sy;
            $(o).offset({left: ix + dx, top: iy+ dy});
            dragging = false;
            console.log("mouseup - d:", dx,dy,"/i:", ix, iy);
        });
        $('html').on('mousemove', function(e) {
            if(dragging) {
                dx e.pageX -sx;
                dy = e.pageY -sy;
                $(o).offset({left:ix + dx, top: iy+dy});
                $(debug).text(dx+","+dy);
            }
        })
    });
    // var mouseX = 0;
    // var mouseY = 0;
    // $window.dragStart = function(ev) {
    //     ev.dataTransfer.effectAllowed = 'move';
    //     ev.dataTransfer.setData("Image", ev.target.getAttribute('id'));
    //     ev.dataTransfer.dropEffect = "copyMove";
    //     ev.dataTransfer.setDragImage(ev.target,0,0);  
    //     var pin = angular.element("#dragged_img");
    //     var pin_left = pin.offset().left;
    //     var pin_top = pin.offset().top;
    //      console.log(pin_top, "pin.top", pin_left, "pin.left");
    // }

    // $window.dragEnter = function(ev) {
    // }

    // $window.dragOver = function(ev) {
    //     var eObj = $window.event? window.event : e;
    //     mouseX = eObj.clientX;
        
    //     ev.dataTransfer.dropEffect = "copyMove";
    //     console.log(ev.pageX, ev.pageY);
    // }

    // $window.drop =function(ev) {
    //     var data = ev.dataTransfer.getData("text");
    //     $('#div-pin').css("left", ev.pageX-30+"px").css("top", ev.pageY-40+"px");
    //     console.log(ev.pageX, ev.pageY, "drop");
    //     // var pin = angular.element("#dragged_img");
    //     // console.log(pin.offset().top,"pin.top");
    //     // pin.offset({top: pin.offset().top, left: pin.offset().left})
    //     // ev.target.appendchild(document.getElementById(data));
    // }

    // $window.dragEnd = function(ev) {
    //     console.log(ev.pageX, ev.pageY, "drag");
    //     $('#div-pin').css("left", ev.pageX-76.828125+"px").css("top", ev.pageY-80.5+"px");
    //     var pin = angular.element("#dragged_img");
    //     var pin_left = pin.offset().left;
    //     var pin_top = pin.offset().top;
    //      console.log(pin_top, "pin.top", pin_left, "pin.left");
    //     /*
    //     // pin.offset({top: pin.offset().top, left:pin.offset().left});
    //     $scope.pin_style = {
    //         "position" : "absolute",
    //         "left": pin_left,
    //         "top": pin_top,
    //         "z-index" : "3",
    //         "margin" : "0",
    //         "display" : "block"
    //     };

    //     */

    // }

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