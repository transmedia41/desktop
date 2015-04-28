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

 .controller('DocumentsCtrl', function ($scope, DocumentService, SocketService, localStorageService) {

  //default
  $scope.showDesc = true
  $scope.isVideo = false
  $scope.isPicture = false
  
  DocumentService.getDocuments(function(data){
    console.log(data)
  })


  $scope.showDocumentContent = function(doc){

   

    if (doc.type === 'video') {
        $scope.isVideo = true
        $scope.isPicture = false
    } else {
        $scope.isVideo = false
        $scope.isPicture = true
    }

    $scope.showDesc = false
    $scope.document_title = doc.title;
    $scope.document_link = doc.versionUrl;
    $scope.document_type = doc.type;
    $scope.document_xp = doc.xp;


    //Show / hide document right
  
  }

  $scope.documentsList = [
  {
    'order':1,
    'date':'1298323623006',
    'description':'Naissance de Paolo Salvatore',
    'xp':'',
    'documents':[
    {
      title: 'Photo de naissance',
      thumbnail: 'img/imgPieceAConviction/imgPAC_thumb.jpg',
      versionUrl: '',
      src: 'http://...',
      type: 'photo',
      templateHtml:'http://',   
      xp: '15'
    },
    {
      title: 'Acte de naissance',
      thumbnail: 'img/imgPieceAConviction/imgPAC_thumb.jpg',
      versionUrl: 'http://...',
      src: '',
      type: 'image',
      templateHtml:'http://...',    
      xp: '16'
    },
       {
      title: 'Acte de naissance',
      thumbnail: 'img/imgPieceAConviction/imgPAC_thumb.jpg',
      versionUrl: 'http://...',
      src: '',
      type: 'image',
      templateHtml:'http://...',    
      xp: '16'
    },
     {
      title: 'Acte de naissance',
      thumbnail: 'img/imgPieceAConviction/imgPAC_thumb.jpg',
      versionUrl: 'http://...',
      src: '',
      type: 'image',
      templateHtml:'http://...',    
      xp: '16'
    }
    ]
  },
  {
    'order':2,
    'date':'1288323623006',
    'description':'Emprisonnement de Daniele Salvatore',
    'xp':'',
    'documents': [
    {
      title: 'Vidéosurveillance transaction',
      thumbnail: 'img/imgPieceAConviction/imgPAC_thumb.jpg',
      versionUrl: '',
      src: 'http://...',
      type: 'video',
      templateHtml:'http://',   
      xp: '15'
    }
    ]
  }
  ]// \.documentsList


  
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

})



