'use strict';

/**
 * @ngdoc function
 * @name deskappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the deskappApp
 */
 angular.module('deskappApp')

 .controller('DocumentsCtrl', function ($scope, SocketService, localStorageService) {


  var i = 1
  this.click = function(i){
    var r = i
    console.log('click', r)
  }


  $scope.showDocumentContent = function(){
    console.log('click')
    $('.imGD').show()

  }


  $scope.documentsList = [
  {
    "order":1,
    "date":"",
    "description":"Naissance de Paolo Salvatore",
    "xp":"",
    "documents":[
    {
      title: "Photo de naissance",
      thumbnail: "img/imgPieceAConviction/imgPAC_thumb.jpg",
      versionUrl: "",
      src: "http://...",
      type: "photo",
      templateHtml:"http://",   
      xp: "15"
    },
    {
      title: "Acte de naissance",
      thumbnail: "img/imgPieceAConviction/imgPAC_thumb.jpg",
      versionUrl: "http://...",
      src: "",
      type: "image",
      templateHtml:"http://...",    
      xp: "16"
    },
       {
      title: "Acte de naissance",
      thumbnail: "img/imgPieceAConviction/imgPAC_thumb.jpg",
      versionUrl: "http://...",
      src: "",
      type: "image",
      templateHtml:"http://...",    
      xp: "16"
    },
     {
      title: "Acte de naissance",
      thumbnail: "img/imgPieceAConviction/imgPAC_thumb.jpg",
      versionUrl: "http://...",
      src: "",
      type: "image",
      templateHtml:"http://...",    
      xp: "16"
    }
    ]
  },
  {
    "order":2,
    "date":"",
    "description":"Emprisonnement de Daniele Salvatore",
    "xp":"",
    "documents": [
    {
      title: "Vidéosurveillance transaction",
      thumbnail: "img/imgPieceAConviction/imgPAC_thumb.jpg",
      versionUrl: "",
      src: "http://...",
      type: "video",
      templateHtml:"http://",   
      xp: "15"
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

