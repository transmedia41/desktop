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

  $scope.test = 'pimp'
    
  })
