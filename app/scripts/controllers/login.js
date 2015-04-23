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
  
  .controller('mainBarController', function ($scope, HTTPAuhtService, localStorageService) {
    $scope.logoutFunc = function() {
      console.log('click logout')
      if(localStorageService.isSupported) {
        var t = localStorageService.get('wstoken')
        if(t){
          HTTPAuhtService.logout().
            success(function(data, status, headers, config) {
              // console.log('disconnect')
            }).
            error(function(data, status, headers, config) {
              // ...
            })
        }
      }
    }
  })

  .controller('loginController', function ($scope, HTTPAuhtService, SocketService) {
    
    $scope.loginFunc = function() {
      var data = {
        username: $scope.username,
        password: $scope.password
      }
      HTTPAuhtService.login(data).
        success(function(data, status, headers, config) {
          console.log('connect with token: ', data.token)
          SocketService.connect(data.token)
        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        })
    }
  
  })

  .controller('registerController', function ($rootScope, $scope, HTTPAuhtService) {
  
    $scope.registerFunc = function() {
      if($scope.password == $scope.confirm) {
        var data = {
          username: $scope.username,
          password: $scope.password
        }
        HTTPAuhtService.register(data).
          success(function(data, status, headers, config) {
            $rootScope.$emit('register')
          }).error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          })
      } else {
        console.log('invalide confirm password')
      }
    }
    
  })
