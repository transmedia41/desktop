'use strict';

var colors = {
  rouge : "#9e1915",
  orangeFonce :"#ea590c",
  orange:"#ffca61",
  jaune:"#fff161",
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

  .controller('SectorsCtrl', function ($scope, $rootScope, $interval, ngProgress, SocketService, SectorService) {

    $scope.progressInfluence = {
      label: 0,
      percentage: 0
    }
    
    $scope.$watch('progressInfluence', function (newValue) {
      newValue.percentage = newValue.label / 100
    }, true)
    
    $rootScope.$on('click on sector', function(e, featureSelected){
      var nbRound = Math.abs($scope.progressInfluence.label-featureSelected.properties.influence)
      if(nbRound > 0){
        $interval(function(){
          if($scope.progressInfluence.label>featureSelected.properties.influence) {
            $scope.progressInfluence.label--
          } else {
            $scope.progressInfluence.label++
          }
        }, 10, nbRound, true, featureSelected)
      }
    })
     
    $scope.makeAction = function(actionId){
      ngProgress.start()
      var o = {
        id : actionId,
        sector_id : $scope.completeSectorSelected.id
      }
      SocketService.getSocket().emit('make action', o)
      $scope.closeDashboard()
    }
    
    $rootScope.$on('complete sector update after action', function(){
      ngProgress.complete()
    })

  })

  .controller('SectorDashboardCtrl', function ($scope, $rootScope, SectorService) {
    
    $scope.visible = false
    
    $scope.closeDashboard = function(){
      $scope.visible = false
    }
    
    $rootScope.$on('click on sector', function(e, featureSelected){
      $scope.visible = true
    })
    
  })
 
 
  .controller('MapSectorCtrl', function ($scope, $rootScope, leafletData, geolocation, SectorService, GameCoreService, Config, ngProgress, SocketService) {
   
    var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + Config.mapboxMapId + "/{z}/{x}/{y}.png?access_token=" + Config.mapboxAccessToken
    
    $scope.paths = {}
    $scope.geojson = {}
    
    function getCooldownTest(secTot) {
      var rest = secTot / 3600
      var h = Math.floor(rest)
      rest = (rest - h) * 60
      var min = Math.floor(rest)
      var sec = Math.floor((rest - min) * 60)
      return h+'h '+min+'\'\' '+sec+'\''
    }
    
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
      
        updateActionDescription: function(action) {
          if (action.isAvailable) {
            action.disponibility = 'Maintenant'
          } else {
            var secTot = (action.coolDown + action.lastPerformed) - Math.floor(Date.now()/1000)
            action.disponibility = getCooldownTest(secTot)
          }
          $scope.actionSelected = action
        },
      
        addSectorsGeoJSONToMap: function(sectors) {
          $scope.geojson = {
            data: {
              type: "FeatureCollection",
              features: sectors
            },
           
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
                   case (feature.properties.influence>80 && feature.properties.influence<=100): 
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
      SectorService.getSectorsLocal(function(data){
        $scope.addSectorsGeoJSONToMap(data)
      })
    })
    
    $rootScope.$on('sector available', function(){
      SectorService.getSectorsLocal(function(data){
        $scope.addSectorsGeoJSONToMap(data)
      })
    })
    
    $scope.$on("leafletDirectiveMap.loading", function(){
      ngProgress.start()
    })
    
    $scope.$on("leafletDirectiveMap.load", function(){
      ngProgress.complete()
    })
    
    
    $scope.$on("leafletDirectiveMap.geojsonClick", function(ev, featureSelected) {
      angular.forEach(featureSelected.properties.actionsPolygon, function(actionPolygon, key){
        featureSelected.properties.actionsPolygon[key].isAvailable = (actionPolygon.lastPerformed + actionPolygon.coolDown < Math.floor(Date.now()/1000))
        var data = {id: featureSelected.id, influence: featureSelected.properties.influence }
        //featureSelected.properties.actionsPolygon[key].expectedDrop = GameCoreService.getExpectedDrop(actionPolygon, data)
        featureSelected.properties.actionsPolygon[key].sectorInfluence = featureSelected.properties.influence
      })
      
      $scope.completeSectorSelected = featureSelected
      $scope.sectorSelected = featureSelected.properties
      if ($rootScope.isSectorActionPerformed(featureSelected.id, featureSelected.properties.nbActions)) {
        $scope.sectorSelected.fullLinkImg = Config.API_URL + featureSelected.properties.character.portrait
      } else {
        $scope.sectorSelected.fullLinkImg = Config.API_URL + 'portraits/unknown.png'
        $scope.sectorSelected.character.sectorDescription = ''
      }
      $scope.nbActionPerformed = Math.min($rootScope.getNbActionPerformed(featureSelected.id), featureSelected.properties.nbActions)
      $scope.updateActionDescription(featureSelected.properties.actionsPolygon[0])
      
      $rootScope.$emit('click on sector', featureSelected)
    })

 })

