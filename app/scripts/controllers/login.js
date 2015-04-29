'use strict';


angular.module('deskappApp')

  .service('HTTPAuhtService', function($http, localStorageService, Config) {

    return {
      login: function(data) {
        return $http.post(Config.API_URL + 'login', data)
      },
      logout: function() {
        var data = {}
        if (localStorageService.isSupported) {
          var t = localStorageService.get('wstoken')
          if (t) {
            data = {
              token: t
            }
          }
        }
        return $http.post(Config.API_URL + 'logout', data)
      },
      register: function(data) {
        return $http.post(Config.API_URL + 'register', data)
      }
    }

  })

  .controller('MainCtrl', function($scope, $modal, $log) {
    $scope.openCredits = function() {
      var modalInstance = $modal.open({
        templateUrl: 'views/modal_credits.html',
        controller: 'ModalCreditsCtrl',
        size: 'lg',
        resolve: {
          items: function() {
            return $scope.items
          }
        }
      });

      modalInstance.result.then(function(selectedItem) {
        $scope.selected = selectedItem
      }, function() {
        $log.info('Modal dismissed at: ' + new Date())
      });
    }
  })

  .controller('mainBarController', function($rootScope, $scope, HTTPAuhtService, localStorageService) {
    // ...
  })

  .controller('loginController', function($rootScope, $scope, $location, HTTPAuhtService, SocketService, localStorageService) {

    function logFunc(data) {
      HTTPAuhtService.login(data).
        success(function(data, status, headers, config) {
          SocketService.connect(data.token).on('connect', function() {
            localStorageService.set('currentPage', 'actions')
            $location.path('/actions')
          })
        }).
        error(function(data, status, headers, config) {
          $scope.error = "Impossible de se connecter"
          setTimeout(function() {
            $scope.error = null
            $rootScope.$apply()
          }, 2000)
          // TODO : Message d'erreur de login
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
    $rootScope.$on('register', function(e, data) {
      logFunc(data)
    })

  })


  .controller('registerController', function($rootScope, $scope, HTTPAuhtService) {
    $scope.registerFunc = function() {
      if ($scope.password == $scope.confirm) {
        var dataReg = {
          username: $scope.username,
          password: $scope.password
        }
        HTTPAuhtService.register(dataReg).
          success(function(data, status, headers, config) {
            $rootScope.$emit('register', dataReg)
          }).error(function(data, status, headers, config) {
          $scope.error = "Impossible de s'enregistrer"
          setTimeout(function() {
            $scope.error = null
            $rootScope.$apply();
          }, 2000)
          // TODO : message erreur de register
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        })
      } else {
        $scope.error = "Confirmation de password invalide"
        setTimeout(function() {
          $scope.error = null
          $rootScope.$apply();
        }, 2000)
      }
    }

  })


  .controller("PanelController", function() {

    this.tab = 1
    this.selectTab = function(setTab) {
      this.tab = setTab
    }
    this.isSelected = function(checkTab) {
      return this.tab === checkTab
    }

  })

  .controller("ModalCreditsCtrl", function($scope, $modalInstance) {
    $scope.ok = function() {
      $modalInstance.close()
    }
  })
