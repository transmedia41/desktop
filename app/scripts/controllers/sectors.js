'use strict';

/**
 * @ngdoc function
 * @name deskappApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the deskappApp
 */
 angular.module('deskappApp')
 
 .service('SectorService', function(localStorageService, SocketService){

    var sectors = []
    
    function getListSectors(callback) {
      SocketService.getSocket()
        .emit('get sectors')
        .on('sectors responce', function(data){
          localStorageService.set('sectors', data)
          localStorageService.set('last update sectors', Date.now())
          //console.log('get sectors')
          sectors = data
          callback(sectors)
        })
    }

    var service = {
      getSectors: function(callback) {
        if(localStorageService.isSupported){
          if(!localStorageService.get('sectors')){
            getListSectors(callback)
          } else {
            var lastDisconnect
            (!localStorageService.get('last disconnect')) ? lastDisconnect = 0 : lastDisconnect = localStorageService.get('last disconnect')
            if(lastDisconnect > localStorageService.get('last update sectors')) {
              getListSectors(callback)
            } else {
              sectors = localStorageService.get('sectors')
              callback(sectors)
            }
          }
        } else {
          $rootScope.$emit('localstorage not supported')
        }
      },
      onUpdate: function(callback) {
        // use socket to track update and execute callback...
        // update sectors and save into localstorage
        socket.on('sectors update', function(data) {
          callback(data)
        })
      }
    }
    return service

  })

 
 .controller('MainSectorsCtrl', function ($scope) {
    //...
  })

 .controller('SectorsCtrl', function ($scope, SocketService, SectorService) {

    $scope.sectors = SectorService.getSectors(function(data){
      //console.log(data)
    })

    /*SocketService.getSocket()
      .emit('get sectors')
      .on('sectors responce', function(data){
        console.log(data)
        $scope.selectors = data
      })*/

    $scope.roundProgressData = {
      label: 10,
      percentage: 0
    }

    $scope.$watch('roundProgressData', function (newValue) {
      newValue.percentage = newValue.label / 100;
    }, true)

  })
