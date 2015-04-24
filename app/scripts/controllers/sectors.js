'use strict';

/**
 * @ngdoc function
 * @name deskappApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the deskappApp
 */
 angular.module('deskappApp')

 .controller('SectorsCtrl', function ($scope, SocketService) {

  $scope.selectors = []

  SocketService.getSocket()
  .emit('get sectors')
  .on('sectors responce', function(data){
    console.log(data)
    $scope.selectors = data
  })

  $scope.roundProgressData = {
   label: 100,
   percentage: 10
 }

 $scope.$watch('roundProgressData', function (newValue) {
          newValue.percentage = newValue.label / 100;
        }, true)

})
