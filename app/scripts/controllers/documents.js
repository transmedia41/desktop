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

    console.log($scope.documentList)
//
//    $scope.openLightboxModal = function (index, document) {
//      $scope.images = document.documents
//      $scope.rootUrl = Config.API_URL
//
//      console.log(document.documents)
//      for (var i = 0; i < document.documents.length; i++) {
//        document.documents[i].src = Config.API_URL + document.documents[i].src
//        console.log(document.documents[i])
//      };
//
//      Lightbox.openModal($scope.images, index)
//    }


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
          return $scope.items;
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



    

}).controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, Config) {
  $scope.rootUrl = Config.API_URL
  console.log($scope.rootUrl)
  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}).controller("panelController", function($scope) {
  this.tab = 1;
  this.selectTab = function(setTab) {
    this.tab = setTab;
  }
  this.isSelected = function(checkTab) {
    return this.tab === checkTab;
  } 
})










/*Lightbox.$on('click', function() {
      console.log($scope);
    })*/



  
  // CODE DE JOEL : test d'interaction avec le web service
  /*$scope.events = []
    
    if(localStorageService.isSupported){
      if(!localStorageService.get('events')){
        // events pas présents on les demande tous
        SocketService.getSocket()
          .emit('get events')
          .on('events responce', function(data){
            localStorageService.set('events', data)
            console.log('get events')
            $scope.events = data
            updateEvent()
          })
      } else {
        $scope.events = localStorageService.get('events')
        updateEvent()
      }
    } else {
      $rootScope.$emit('localstorage not supported')
    }
  
    function updateEvent(){
      console.log($scope.events)
    }*/




