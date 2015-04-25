'use strict';

/**
 * @ngdoc function
 * @name deskappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the deskappApp
 */
 angular.module('deskappApp')

 .filter('convertName', function() {
  return function(item) {
    var out = item
   if (item == 'video') {
    out = 'play'
    return out
   } 
    else if (item == 'photo') {
     out = 'camera'  
    return out
  } else {
    out = 'picture'
    return out 
  }
  }
})



 .controller('DocumentsCtrl', function ($scope) {


  var i = 1
  this.click = function(i){
    var r = i
    console.log('click', r)
  }



  $scope.showDocumentContent = function(){
    console.log('click')
 

  }


  $scope.documentsList = [
  {
    "order":1,
    "date":"1298323623006",
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
    "date":"1288323623006",
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



})




