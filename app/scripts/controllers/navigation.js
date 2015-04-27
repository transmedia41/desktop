'use strict';

/**
 * @ngdoc function
 * @name deskappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the deskappApp
 */
angular.module('deskappApp')

  .controller('NavBarCtrl', function ($rootScope, $scope, $location, localStorageService) {
  
    function setBtnsFalse() {
      $scope.actionsBtn = false
      $scope.tacticBtn = false
      $scope.documentsBtn = false
      $scope.mafiaBtn = false
    }
    setBtnsFalse()
    
    $scope.goToActions = function() {
      setBtnsFalse()
      $scope.actionsBtn = true
    }
    $scope.goToTactic = function() {
      setBtnsFalse()
      $scope.tacticBtn = true
    }
    $scope.goToDocuments = function() {
      setBtnsFalse()
      $scope.documentsBtn = true
    }
    $scope.goToMafia= function() {
      setBtnsFalse()
      $scope.mafiaBtn = true
    }
    
    function update() {
      if(localStorageService.get('currentPage')) {
        switch(localStorageService.get('currentPage')) {
          case '/actions':
            $scope.goToActions()
            break;
          case '/tactic':
            $scope.goToTactic()
            break;
          case '/documents':
            $scope.goToDocuments()
            break;
          case '/mafia':
            $scope.goToMafia()
            break;
        }
      }
    }
    update()
  
    $rootScope.$on('update navbar', function(){
      update()
    })
  
  })
  
  .controller('mainBarGameController', function ($rootScope, $scope, $timeout, HTTPAuhtService, SocketService, localStorageService) {
    
    $scope.playerInfos = ''
  
    $scope.logoutFunc = function() {
      if(localStorageService.isSupported) {
        var t = localStorageService.get('wstoken')
        if(t){
          HTTPAuhtService.logout().
            success(function(data, status, headers, config) {
              // console.log('disconnect')
              /*$rootScope.gameBar = false
              localStorageService.remove('currentPage')*/
            }).
            error(function(data, status, headers, config) {
              // ...
            })
        }
      }
    }
    
    function updateInfos(data) {
      $scope.playerInfos = data.username
      $scope.playerRank =  data.level.rankName
      $scope.level =  data.level.level
      if(data.level.level == 12) {
        // general, last level
        $scope.nbXP = data.xp
        $timeout(function(){
          $scope.progressBar = {
            transition: 'width 1s ease-in-out',
            width: '100%'
          }
        }, 200);
      } else {
        $scope.nbXP = data.xp-data.level.xp
        $scope.nextLvlXP = data.level.xpMax+1-data.level.xp
        $timeout(function(){
          $scope.progressBar = {
            transition: 'width 1s ease-in-out',
            width: ((data.xp-data.level.xp)/(data.level.xpMax-data.level.xp)*100)+'%'
          }
        }, 200);
      }
      $scope.$apply()
    }
    
    $rootScope.$on('user responce', function(e, data){
      updateInfos(data)
      
      // emulate new xp
      /*$timeout(function(){
        console.log('progress')
        $scope.progressBar = {
          transition: 'width 1s ease-in-out',
          width: ((data.xp+16)/(data.level.xpMax)*100)+'%'
        }
      }, 4000);*/

      
    })
    
    if(typeof SocketService.getSocket() != 'undefined') {
      SocketService.getSocket().on('user update', function(data){
        updateInfos(data)
      })
    }
    
    
    $rootScope.$on('disconnected', function(e, data){
      $scope.playerInfos = ''
      $scope.playerRank = ''
      $scope.progressBar = {
        transition: 'width 1s ease-in-out',
        width: '0%'
      }
      $scope.$apply()
    })
    
    $scope.progressBar = {
      transition: 'width 1s ease-in-out'
    }
    
    
  })