'use strict';

/**
 * @ngdoc function
 * @name deskappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the deskappApp
 */
angular.module('deskappApp')

 
   .service('PlayerService', function($rootScope, SocketService){

    var service = {
      getPLayers: function(callback) {
        SocketService.getSocket()
        .emit('get users')
        .on('users responce', function(data){
          callback(data)
        })
      }
    }
    return service
    
  })

  .controller('MainPlayerCtrl', function ($rootScope, $scope, PlayerService) {
    
    $scope.players = []
    
    PlayerService.getPLayers(function(data){
      $scope.players = data
    })
    
  })