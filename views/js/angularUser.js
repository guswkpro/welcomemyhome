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
		// $http({
		// 	method: 'POST',
		// 	url: '/test',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	data: ({
		// 		'id': 'sw1',
		// 		'pw': '1234',
		// 		'nickname': 'mongo1'
		// 	})
		// }).success(function (response) {
		// 	console.log(response);
		// }).finally(function () {
		// 	console.log('complete');
		// });

		$http.post('/test', {'test' : 'test'}).success(function (response){
			console.log('caaaaaaaaaaaaaaaaaaaaaaaaa');
			console.log(response);
		}).finally(function(){
			console.log('complete');
		});
	}
});