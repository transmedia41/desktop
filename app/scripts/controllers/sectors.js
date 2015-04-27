'use strict';

/**
 * @ngdoc function
 * @name deskappApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the deskappApp
 */
 angular.module('deskappApp')
 
 .service('SectorService', function(localStorageService, SocketService){

    var sectors = []
    
    function getListSectors(callback) {
      SocketService.getSocket()
        .emit('get sectors')
        .on('sectors responce', function(data){
          localStorageService.set('sectors', data)
          localStorageService.set('last update sectors', Date.now())
          //console.log('get sectors')
          sectors = data
          callback(sectors)
        })
    }

    var service = {
      getSectors: function(callback) {
        if(localStorageService.isSupported){
          if(!localStorageService.get('sectors')){
            getListSectors(callback)
          } else {
            var lastDisconnect
            (!localStorageService.get('last disconnect')) ? lastDisconnect = 0 : lastDisconnect = localStorageService.get('last disconnect')
            if(lastDisconnect > localStorageService.get('last update sectors')) {
              getListSectors(callback)
            } else {
              sectors = localStorageService.get('sectors')
              callback(sectors)
            }
          }
        } else {
          $rootScope.$emit('localstorage not supported')
        }
      },
      onUpdate: function(callback) {
        // use socket to track update and execute callback...
        // update sectors and save into localstorage
        socket.on('sectors update', function(data) {
          callback(data)
        })
      }
    }
    return service

  })

 
 .controller('MainSectorsCtrl', function ($scope) {
    //...
  })

 .controller('SectorsCtrl', function ($scope, $rootScope, SocketService, SectorService) {

    $scope.sectors = SectorService.getSectors(function(data){
      //console.log(data)
    })

    /*SocketService.getSocket()
      .emit('get sectors')
      .on('sectors responce', function(data){
        console.log(data)
        $scope.selectors = data
      })*/

    $scope.roundProgressData = {
      label: 10,
      percentage: 0
    }

    $scope.$watch('roundProgressData', function (newValue) {
      newValue.percentage = newValue.label / 100;
    }, true)
    
    $scope.makeAction = function(){
      console.log('click')
      SocketService.getSocket().emit('make action')
    }

  })

  .controller('SectorDashboardCtrl', function ($scope, $rootScope, SectorService) {
    
    $scope.visible = false // init value
    
    $scope.closeDashboard = function(){
      $scope.visible = false
    }
    
    $rootScope.$on('click on sector', function(e, featureSelected){
      console.log(featureSelected)
      $scope.visible = true
    })
    
  })
 
 
  .controller('MapSectorCtrl', function ($scope, $rootScope, leafletData, geolocation, SectorService) {
    
    var mapboxMapId =  "hydromerta.lpkj6fe5"
    var mapboxAccessToken = "pk.eyJ1IjoiaHlkcm9tZXJ0YSIsImEiOiJZTUlDdVA0In0.Z7qJF3weLg5WuPpzt6fMdA"
    var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken
    
    $scope.paths = {}
    $scope.geojson = {}
    
    
	angular.extend($scope, {
      
	    defaults: {
          maxZoom: 18,
          minZoom: 14,
          attributionControl: false,
          tileLayer: mapboxTileLayer,
          zoomControl:false
	    },
      
	    maxbounds: {
          southWest: {
            lat: 46.749859206774524,
            lng: 6.559438705444336
          },
          northEast: {
           lat: 46.8027621127906,
           lng: 6.731100082397461
          }
        },
      
	    mapCenter: {
          lat: 46.779463, 
          lng: 6.638802,
          zoom: 14
        },
      
	    layers: {
          baselayers: {
            xyz: {
              name: 'OpenStreetMap (XYZ)',
              url: mapboxTileLayer,
              type: 'xyz'
            }
          },
          
          overlays: {
            markers:{
              type: 'group',
              name: 'Markers',
              visible: false
            },
            circles:{
              type: 'group',
              name: 'Circles',
              visible: false
            },
            sectors:{
              type: 'group',
              name: 'Sectors',
              visible: true
            },
            yverdon :{
              type: 'group',
              name: 'Yverdon',
              visible: false
            }
          }
        },
      
        addSectorsGeoJSONToMap: function(sectors) {
          $scope.geojson = {
            data: {
              type: "FeatureCollection",
              features: sectors
            },
            style: function (feature) {
              switch (feature.properties.nomsquart) {
                case 'Quartier 4': 
                  return {
                    fillColor: "#db0032",
                    weight: 4,
                    opacity: 1,
                    color: 'white',
                    dashArray: '9',
                    fillOpacity: 0.7
                  }
                default:
                  return {
                    fillColor: "#3b8931",
                    weight: 4,
                    opacity: 1,
                    color: 'white',
                    dashArray: '9',
                    fillOpacity: 0.7
                  }
              }
            }
          }
        }

	})
    
    SectorService.getSectors(function(data){
      $scope.addSectorsGeoJSONToMap(data)
      console.log($scope.geojson)
    })
    
    $scope.$on("leafletDirectiveMap.geojsonClick", function(ev, featureSelected, leafletEvent) {
      console.log(featureSelected, leafletEvent)
      $rootScope.$emit('click on sector', featureSelected)
    })

 })

