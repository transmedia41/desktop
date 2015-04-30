'use strict';

/**
 * @ngdoc function
 * @name deskappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the deskappApp
 */
 angular.module('deskappApp')



  .controller('MainDocumentsCtrl', function ($scope) {
    //...
  }).config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'https://vimeo.com/**',
    'http://localhost:3000/**'
  ])
})
 
   .service('DocumentService', function($rootScope, SocketService){

    var documents = []
    
    var service = {
      getDocuments: function(callback) {
        SocketService.getSocket()
        .emit('get my documents')
        .on('my documents responce', function(data){
          documents = data
          callback(data)
        })
      },
      getDocumentsLocal: function() {
        return documents
      }
    }
    return service
    

  })

   .filter('convertName', function() {
    return function(item) {
      var out = item
      if (item === 'video') {
        out = 'play'
        return out
      } 
      else if (item === 'photo') {
        out = 'camera'  
        return out
      } else {
        out = 'picture'
        return out 
      }
    }
  })

  .config(function (LightboxProvider) {
  // set a custom template
  LightboxProvider.templateUrl = 'views/Lightbox.html';
})


 .controller('DocumentsCtrl', function ($scope, DocumentService, SocketService, localStorageService, Lightbox, Config, $modal, $log) {

    DocumentService.getDocuments(function(data){
      console.log('documents', data)
      $scope.rootUrl = Config.API_URL
      $scope.$apply($scope.documentsList = data)
    })

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function (size, doc) {
    $scope.items = doc
    SocketService.getSocket().emit('document vu', doc.id)
    console.log($scope.items)
    var modalInstance = $modal.open({
      templateUrl: 'views/modal.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items
        },
        audio: function() {
          return $scope.audio
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }



// Tabulation dans la light box

this.tab = 1;
  this.selectTab = function(setTab) {
    console.log('click');
    this.tab = setTab;
  }
  this.isSelected = function(checkTab) {
    return this.tab === checkTab;
  } 

}).controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, Config, ngAudio) {
  $scope.rootUrl = Config.API_URL
  if (items.type === "audio") $scope.audio = ngAudio.load($scope.rootUrl + items.src)
  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

    $scope.toggle = true;
    $scope.$watch('toggle', function(){
        $scope.toggleText = $scope.toggle ? 'Play' : 'Pause';
    })

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };
  $scope.cancel = function () {
    if ($scope.audio) $scope.audio.stop()
    $modalInstance.dismiss('cancel');
  };
}).controller("panelController", function($scope, $sce) {
  this.tab = 1;
  this.selectTab = function(setTab) {
    this.tab = setTab;
  }
  this.isSelected = function(checkTab) {
    return this.tab === checkTab;
  } 
})