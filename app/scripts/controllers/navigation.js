'use strict';

/**
 * @ngdoc function
 * @name deskappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the deskappApp
 */
angular.module('deskappApp')

  .controller('NavBarCtrl', function ($scope, $location, localStorageService) {
  
    function setBtnsFalse() {
      $scope.actionsBtn = false,
      $scope.tacticBtn = false,
      $scope.documentsBtn = false,
      $scope.mafiaBtn = false
      /*if(localStorageService.isSupported) {
        localStorageService.remove('currentPage')
      }*/
    }
    setBtnsFalse()
    
    $scope.goToActions = function() {
      setBtnsFalse()
      $scope.actionsBtn = true
      localStorageService.set('currentPage', 'actions')
    }
    $scope.goToTactic = function() {
      setBtnsFalse()
      $scope.tacticBtn = true
      localStorageService.set('currentPage', 'tactic')
    }
    $scope.goToDocuments = function() {
      setBtnsFalse()
      $scope.documentsBtn = true
      localStorageService.set('currentPage', 'documents')
    }
    $scope.goToMafia= function() {
      setBtnsFalse()
      $scope.mafiaBtn = true
      localStorageService.set('currentPage', 'mafia')
    }
    
    if(localStorageService.get('currentPage')) {
      switch(localStorageService.get('currentPage')) {
        case 'actions':
          $scope.goToActions()
          break
        case 'tactic':
          $scope.goToTactic()
          break
        case 'documents':
          $scope.goToDocuments()
          break
        case 'mafia':
          $scope.goToMafia()
          break
        default:
          break
      }
    }
  
  })