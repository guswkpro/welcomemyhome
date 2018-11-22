var myApp = angular.module('myApp', []);

angular.element(document).ready(function() {
  myApp.controller('logincheckCtrl', function($scope, $http) {
    $http({
      method: 'GET',
      url: '/',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      params: {
        user_auth: user_auth
      }
    }).success(function(response) {
      console.log(response.RESULT);
      if (response.RESULT == "1") {

      } else {

      }
    })
  });
})
