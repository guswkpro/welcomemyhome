var app = angular.module('user', []);

app.controller('loginController', function ($scope, $http) {
	$http.post('/login').then(function (res) {
		$scope.user = res.data.memlist[0].mem_id;
	});
});

app.controller('signupController', function ($scope, $http, $window) {
	console.log('aaa');
	$scope.pushData = function () {
		console.log('aaaa');
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
			if(response.RESULT == "1"){
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