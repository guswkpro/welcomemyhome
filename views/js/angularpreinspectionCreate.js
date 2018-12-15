var app = angular.module('preinspectionCreate', []);

app.controller('logincheckCtrl', function ($scope, $http, $window) {
  $scope.load = function () {
    $http.get('/logincheck').success(function (response) {
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

app.controller('preinspectionCreateCtrl', function ($scope, $http, $window) {

  var image_width, image_height;

  function readImage(file) {
    var reader = new FileReader();
    var image = new Image();

    reader.readAsDataURL(file);
    reader.onload = function(_file) {
      image.src = _file.target.result;
      image.onload = function() {
        image_width = this.width;
        image_height = this.height;
        console.log(image_width, image_height);
      }
    }
  }

  $("#fileselector").change(function(e) {
    var F = this.files;
    if(F && F[0]) for(var i=0; i<F.length; i++) readImage(F[i]);
  });

  // preinspection 작성 취소
  $scope.cancelpreinspectionCreate = function () {
    var msg = "작성을 취소하여 사전 점검로 이동합니다.";
    $window.alert(msg);
    $window.location.href = '/preinspection';
  };

  // preinspection 도면 등록
  $scope.pushpreinspectionBluePrint = function () {
    var input = document.getElementById('fileselector');
    var fr = new FileReader();
    fr.readAsDataURL(input.files[0]);
    fr.onload = function () {
      console.log(image_width, image_height);
      var str = fr.result.split(',')[1];
      console.log(str);
      $http({
        method: 'POST',
        url: '/addpreinspectionblueprint',
        headers: {
          'Content-Type': 'application/json'
        },
        data: ({
          image: str,
          width: image_width,
          height: image_height
        })
      }).success(function (response) {
        if (response.RESULT == "1") {
          console.log("도면");
          var msg = "도면 등록에 성공하셨습니다.";
          $window.alert(msg);
          $window.location.href = '/preinspection';
        } else {
          console.log("도면");
          var msg = "알 수 없는 오류로 도면 등록에 실패하였습니다.";
          $window.alert(msg);
          $window.location.href = '/preinspection';
        }
      }).error(function () {
        console.log("error");
      });
    };
  };
});