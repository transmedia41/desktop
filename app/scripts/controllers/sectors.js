'use strict';

var colors = {
  rouge : "#9e1915",
  orangeFonce :"#ea590c",
  orange:"#fff161",
  jaune:"#ffca61",
  vert:"#089b6e"
}

/**
 * @ngdoc function
 * @name deskappApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the deskappApp
 */
 angular.module('deskappApp')

 
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


    $scope.makeAction = function(){
      //console.log('click')
      SocketService.getSocket().emit('make action')
    }

  })

  .controller('SectorDashboardCtrl', function ($scope, $rootScope, SectorService) {
    
    $scope.visible = false // init value
    
    $scope.closeDashboard = function(){
      $scope.visible = false
    }
    
    $rootScope.$on('click on sector', function(e, featureSelected){
      //console.log(featureSelected)
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
          maxZoom: 16,
          minZoom: 14,
          attributionControl: false,
          tileLayer: mapboxTileLayer,
          zoomControl:false,
          reuseTiles: true
	    },
      
	    maxbounds: {
          southWest: {
            lat: 46.71,
            lng: 6.5
          },
          northEast: {
           lat: 46.85,
           lng: 6.8
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
        updateActionDescription :function(action){
          $scope.actionSelected = action;
          //console.log($scope);
        },
      
        addSectorsGeoJSONToMap: function(sectors) {
          $scope.geojson = {
            data: {
              type: "FeatureCollection",
              features: sectors
            },// 
           //  
            style: function (feature) {
              switch (true) {
                case (feature.properties.influence<=20): 
                  return {
                    fillColor: colors.vert,
                    weight: 4,
                    opacity: 1,
                    color: 'white',
                    dashArray: '9',
                    fillOpacity: 0.7
                  }
                 case (feature.properties.influence>20 && feature.properties.influence<=40): 
                  return {
                    fillColor: colors.jaune,
                    weight: 4,
                    opacity: 1,
                    color: 'white',
                    dashArray: '9',
                    fillOpacity: 0.7
                  }
                 case (feature.properties.influence>40 && feature.properties.influence<=60): 
                  return {
                    fillColor: colors.orange,
                    weight: 4,
                    opacity: 1,
                    color: 'white',
                    dashArray: '9',
                    fillOpacity: 0.7
                  }
                   case (feature.properties.influence>60 && feature.properties.influence<=80): 
                  return {
                    fillColor: colors.orangeFonce,
                    weight: 4,
                    opacity: 1,
                    color: 'white',
                    dashArray: '9',
                    fillOpacity: 0.7
                  }
                   case (feature.properties.influence>80 && feature.properties.influence<100): 
                  return {
                    fillColor: colors.rouge,
                    weight: 4,
                    opacity: 1,
                    color: 'white',
                    dashArray: '9',
                    fillOpacity: 0.7
                  }
                default:
                  return {
                    fillColor: "#089b6e",
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

    
    SectorService.getSectorsLocal(function(data){
      $scope.addSectorsGeoJSONToMap(data)
    })
    
    $rootScope.$on('new sector available', function(){
      console.log('sectors update')
      SectorService.getSectorsLocal(function(data){
        $scope.addSectorsGeoJSONToMap(data)
      })
    })
    
    $rootScope.$on('sector available', function(){
      console.log('sectors charged')
      SectorService.getSectorsLocal(function(data){
        $scope.addSectorsGeoJSONToMap(data)
      })
    })
    
    angular.extend($rootScope, {
      getNbActionPerformed: function(theId) {
        var actionPerformedInTheSector = 0
        angular.forEach($rootScope.playerInfos.sectors, function(sector){
          if(sector.sector_id == theId) {
            actionPerformedInTheSector = sector.actionsPerformed
          }
        })
        return actionPerformedInTheSector
      }
    })
    
    $scope.$on("leafletDirectiveMap.geojsonClick", function(ev, featureSelected, leafletEvent) {
      //console.log(featureSelected, leafletEvent)
      $rootScope.$emit('click on sector', featureSelected)
      $scope.sectorSelected = featureSelected.properties
      $scope.nbActionPerformed = Math.min($rootScope.getNbActionPerformed(featureSelected.id), featureSelected.properties.nbActions)
      $scope.actionSelected = featureSelected.properties.actionsPolygon[0]
      $scope.progressInfluence = {
        label: featureSelected.properties.influence,
        percentage: featureSelected.properties.influence/100
      }
    })

 })

