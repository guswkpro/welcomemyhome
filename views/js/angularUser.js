var app = angular.module('user', []);

app.controller('loginController', function ($scope, $http) {
	$http.post('/login').then(function (res) {
		$scope.user = res.data.memlist[0].mem_id;
	});
});

app.controller('signupController', function ($scope, $http) {
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
				id: 'sw1',
				pw: '1234',
				nickname: 'mongo1'
			})
		}).success(function (response) {
			if(response.RESULT == 1){
				$window.alert("회원가입에 성공하셨습니다. 로그인 후 이용하시기 바랍니다.");
				$window.location.href = '/login';
			} else {
				$window.alert("알수없는 오류로 회원가입에 실패하였습니다.");
			}
		}).finally(function () {
			console.log('complete');
		});
	}
});