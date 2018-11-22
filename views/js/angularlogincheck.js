var myApp = angular.module('myApp', []);

angular.element(document).ready(function() {
  myApp.controller('logincheckCtrl', function($scope, $http) {
    $http.get('/logincheck').success(function(response) {
      console.log(response.RESULT);
      if (response.RESULT == "1") {

      } else {

      }
    });
  });
});
