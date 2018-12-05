var app = angular.module('user', []);

app.controller('logincheckCtrl', function ($scope, $http, $window) {
	$scope.load = function () {
		$http.get('/logincheck').success(function (response) {
			console.log(response.RESULT);
			if (response.RESULT == "1") {
				var msg = "이미 로그인 중입니다."
				$window.alert(msg);
				$window.location.href = '/';
			} else {
				$scope.showHide_logout = true;
			}
		});
	};
	$scope.clickLogout = function () {
		var msg = "logout이 성공하였습니다.";
		$window.alert(msg);
		$window.location.href = '/';
	}
});

app.controller('loginController', function ($scope, $http, $window) {
	$scope.clickLogin = function () {
		$http({
			method: 'POST',
			url: '/login',
			headers: {
				'Content-Type': 'application/json'
			},
			data: ({
				id: $scope.id,
				pw: $scope.pw,
			})
		}).success(function (response) {
			console.log(response.RESULT);
			if (response.RESULT == "1") {
				$window.location.href = '/';
			} else if (response.RESULT == "2") {
				var msg = "존재하지 않는 아이디 입니다.";
				$window.alert(msg);
			} else if (response.RESULT == "3") {
				var msg = "비밀번호가 틀립니다.";
				$window.alert(msg);
			} else if (response.RESULT == "4") {
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
	};

	$scope.clickIdOverlap = function () {
		$http.get('/idcheck', {
			params: {
				user_id: $scope.id
			}
		}).success(function (response) {
			console.log(response.RESULT);
			if (response.RESULT == "0") {
				var msg = "알 수 없는 에러로 중복 확인이 실패하였습니다.";
				window.alert(msg);
			} else if (response.RESULT == "1") {
				var msg = "이미 있는 ID입니다.";
				window.alert(msg);
			} else if (response.RESULT == "2") {
				if (angular.isUndefined($scope.id)) {
					var msg = "ID는 비워둘 수 없습니다.";
					window.alert(msg);
				} else {
					var msg = "사용 가능한 ID입니다.";
					window.alert(msg);
				}
			}
		})
	};

	$scope.clickNicknameOverlap = function () {
		$http.get('/nicknamecheck', {
			params: {
				user_nickname: $scope.nickname
			}
		}).success(function (response) {
			console.log(response.RESULT);
			if (response.RESULT == "0") {
				var msg = "알 수 없는 에러로 중복 확인이 실패하였습니다.";
				window.alert(msg);
			} else if (response.RESULT == "1") {
				var msg = "이미 있는 Nickname입니다.";
				window.alert(msg);
			} else if (response.RESULT == "2") {
				if (angular.isUndefined($scope.nickname)) {
					var msg = "Nickname은 비워둘 수 없습니다.";
					window.alert(msg);
				} else {
					var msg = "사용 가능한 Nickname입니다.";
					window.alert(msg);
				}
			}
		})
	};
});
