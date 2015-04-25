'use strict';

/**
 * @ngdoc function
 * @name deskappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the deskappApp
 */
angular.module('deskappApp')

  .service('HTTPAuhtService', function($http, localStorageService){
  
    return {
      
      login: function(data) {
        return $http.post('http://localhost:3000/login', data)
      },
      logout: function() {
        var data = {}
        if(localStorageService.isSupported) {
          var t = localStorageService.get('wstoken')
          if(t){
            data = {
              token: t
            }
          }
        }
        return $http.post('http://localhost:3000/logout', data)
      },
      register: function(data) {
        return $http.post('http://localhost:3000/register', data)
      }
    
    }
  
  })
  
  .controller('MainCtrl', function ($scope) {
    // ...
  })
  
  .controller('mainBarController', function ($rootScope, $scope, HTTPAuhtService, localStorageService) {
    
    // to do
    
  })

  .controller('loginController', function ($rootScope, $scope, $location, HTTPAuhtService, SocketService, localStorageService) {
  
    function logFunc(data) {
      HTTPAuhtService.login(data).
        success(function(data, status, headers, config) {
          SocketService.connect(data.token).on('connect', function(){
            localStorageService.set('currentPage', 'actions')
            $location.path('/actions')
          })
        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        })
    }
    
    $scope.loginFunc = function() {
      var data = {
        username: $scope.username,
        password: $scope.password
      }
      logFunc(data)
    }
    $rootScope.$on('register', function(e, data){
      logFunc(data)
    })
  
  })


  .controller('registerController', function ($rootScope, $scope, HTTPAuhtService) {
  
    $scope.registerFunc = function() {
      if($scope.password == $scope.confirm) {
        var dataReg = {
          username: $scope.username,
          password: $scope.password
        }
        HTTPAuhtService.register(dataReg).
          success(function(data, status, headers, config) {
            $rootScope.$emit('register', dataReg)
          }).error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          })
      } else {
        console.log('invalide confirm password')
      }
    }
    
  })


  .controller("PanelController", function(){
  
    this.tab = 1
    this.selectTab = function(setTab){
      this.tab = setTab
    }
    this.isSelected = function(checkTab){
      return this.tab === checkTab
    }
    
  })
