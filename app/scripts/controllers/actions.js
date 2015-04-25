'use strict';

/**
 * @ngdoc function
 * @name deskappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the deskappApp
 */
angular.module('deskappApp')

  .controller('ActionsCtrl', function ($scope, SectorService) {
    
    $scope.sectors = SectorService.getSectors(function(data){
      console.log(data)
    })
    
  })