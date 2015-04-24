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