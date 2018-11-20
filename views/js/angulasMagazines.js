var app = angular.module('magazines', []);

app.controller('magazinesController', function ($scope, $http, $window) {
	$scope.clickPicture = function(){
		$http({
			method: 'POST',
			url: '/magazine1',
			headers: {
				'Content-Type': 'application/json'
			},
			data: ({
				id: $scope.id,
				pw: $scope.pw,
			})
		}).success(function (response){
			console.log(response.RESULT);
			if(response.RESULT == "1"){
				$window.location.href = '/';
			} else if(response.RESULT =="2"){
				var msg = "존재하지 않는 아이디 입니다.";
				$window.alert(msg);
			} else if(response.RESULT =="3"){
				var msg = "비밀번호가 틀립니다.";
				$window.alert(msg);
			} else if(response.RESULT =="4"){
				var msg = "탈퇴한 회원입니다.";
				$window.alert(msg);
			}
		})
	}
});

app.controller('signupController', function ($scope, $http, $window) {
	$scope.pushData = function () {
		$http({
			method: 'POST',
			url: '/signup',
			headers: {
				'Content-Type': 'application/json'
			},
			data: ({
				id: $scope.id,
				pw: $scope.pw,
				nickname: $scope.nickname
			})
		}).success(function (response) {
			if (response.RESULT == "1") {
				var msg = "회원가입에 성공하셨습니다. 로그인 후 이용하시기 바랍니다.";
				$window.alert(msg);
				$window.location.href = '/login';
			} else {
				var msg = "알수없는 오류로 회원가입에 실패하였습니다.";
				$window.alert(msg);
			}
		});
	}
});