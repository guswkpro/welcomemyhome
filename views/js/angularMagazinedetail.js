var app = angular.module('magazinedetail', []);

$http.get('/getestimatelist', {
  params: {
    magazine_idx: 15
  }
