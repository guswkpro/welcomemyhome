var app = angular.module('userController', []);

app.controller('loginController', function($scope, $http) {
	$http.post('/login').then(function(res) {
		$scope.user = res.data.memlist[0].mem_id;
	});
}); 

app.controller('signupController', function($scope, $http){
    $http.post('/signup').then
})