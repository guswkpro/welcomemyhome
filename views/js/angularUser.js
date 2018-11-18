var app = angular.module('user', []);

app.controller('loginController', function($scope, $http) {
	$http.post('/login').then(function(res) {
		$scope.user = res.data.memlist[0].mem_id;
	});
}); 

app.controller('signupController', function($scope, $http){
    $http({
		method : 'POST',
		url : '/test',
		data: $.param({
			'id' : 'sw1',
			'pw' : '1234',
			'nickname' : 'mongo1'
		}),
		headers:{
			'Content-Type' : 'application/json'
		}
	}).success(function (response){
		console.log(response);
		$scope.pushData = function(){
			console.log('aaaa');
		}
	}).finally(function(){
		console.log('complete');
	});
});