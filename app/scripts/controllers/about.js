'use strict';

/**
 * @ngdoc function
 * @name deskappApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the deskappApp
 */
angular.module('deskappApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
