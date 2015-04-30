'use strict';


/**
 * @ngdoc function
 * @name deskappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the deskappApp
 */
angular.module('deskappApp')

 
  .controller('MainActionsCtrl', function ($scope) {
    //...
  })

  .controller('ActionsCtrl', function ($scope, SectorService) {
    // ...
  })


  .controller('ActionDashboardCtrl', function ($scope, $rootScope, SectorService, GameCoreService, SocketService) {
    
    $scope.visible = false
    
    $scope.closeDashboard = function(){
      $scope.visible = false
    }
    
    $scope.makeActionPoint = function(){
      SocketService.getSocket().emit('make action point')
    }
    
    $rootScope.$on('click on marker', function(e, featureSelected){
      $scope.visible = true
      $scope.markerSelected = featureSelected
      $scope.markerSelected.expectedDrop = GameCoreService.getExpectedDrop(featureSelected.properties, featureSelected.sector)
    })
    
  })

  .controller('MapActionCtrl', function ($scope, $rootScope, leafletData, geolocation, SectorService, Config, ngProgress) {
    
    var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + Config.mapboxMapId + "/{z}/{x}/{y}.png?access_token=" + Config.mapboxAccessToken
    
    
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
        zoom: 15
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

      markers: {},
      geojson: {},

      addSectorsGeoJSONToMap: function(sectors) {
        $scope.geojson = {
          data: {
            type: "FeatureCollection",
            features: sectors
          },
          style: function (feature) {
            return {
              weight: 5,
              opacity: 1,
              color: 'white',
              dashArray: '12',
              fillOpacity: 0.4
            }
          }
        }
      },


        addMarkersToMap : function(points){
          var markers= []
          angular.forEach(points,function(point,index){
            var marker = {
              lat : point.geometry.coordinates[1],
              lng : point.geometry.coordinates[0],
              properties : point.properties,
              icon: {}
            }
            switch(point.properties.type.toLowerCase()) {
              case 'hydrante':
                marker.icon.extraClasses = 'icon-hydrante'
                marker.icon.iconImg = 'img/hydrante.png'//hydrante
                break;
              case 'fontaine':
                marker.icon.extraClasses = 'icon-fontaine'
                marker.icon.iconImg = 'img/fontaine.png'
                break;
              case 'arrosage':
                marker.icon.extraClasses = 'icon-arrosage'
                marker.icon.iconImg = 'img/arrosage.png'
                break;
              case 'affiche':
                marker.icon.extraClasses = 'icon-affiche'
                marker.icon.iconImg = 'img/affiche.png'
                break;
              case 'toilettes':
                marker.icon.extraClasses = 'icon-toilettes'
                marker.icon.iconImg = 'img/toilettes.png'
                break;
              case 'bouche_egout':
                marker.icon.extraClasses = 'icon-bouche_egout'
                marker.icon.iconImg = 'img/bouche-egout.png'
                break;
              case 'dechet_lac':
                marker.icon.extraClasses = 'icon-dechet_lac'
                marker.icon.iconImg = 'img/dechet-lac.png'
                break;
            }
            marker.icon.type  = 'extraMarker'
            marker.icon.imgWidth = 42
            marker.icon.imgHeight = 52
            markers.push(marker)
          })
          return markers
        }

	})

    SectorService.getSectorsLocal(function(data){
      $scope.addSectorsGeoJSONToMap(data)
      $scope.markers = $scope.addMarkersToMap(SectorService.getActionPoint())
    })

    

    $rootScope.$on('new sector available', function(){
      console.log('sectors update')
      SectorService.getSectorsLocal(function(data){
        $scope.addSectorsGeoJSONToMap(data)
        $scope.markers = $scope.addMarkersToMap(SectorService.getActionPoint())
      })
    })

    $rootScope.$on('sector available', function(){
      console.log('sectors charged')
      SectorService.getSectorsLocal(function(data){
        $scope.addSectorsGeoJSONToMap(data)
        $scope.markers = $scope.addMarkersToMap(SectorService.getActionPoint())
      })
    })
    
    $scope.$on("leafletDirectiveMap.loading", function(){
      console.log('load les donées')
      ngProgress.start()
    })
    
    $scope.$on("leafletDirectiveMap.load", function(){
      console.log('fini de mettre les donées')
      ngProgress.complete()
    })
    
    $scope.$on("leafletDirectiveMarker.click", function(ev, featureSelected, leafletEvent) {
      $rootScope.$emit('click on marker', featureSelected.model)
    })
  
    
    //$scope.markers = $scope.addSectorMarkersToMap(SectorService.getSectors())
    
    /*SectorService.getSectors(function(data){
      //console.log(data)
      //$scope.markers = $scope.addSectorMarkersToMap(data)
      //$scope.addSectorsPathToMap(data)
      $scope.addSectorsGeoJSONToMap(data)
      //console.log($scope.paths)
    })*/
    
    //var map = leafletData.getMap()
    
    
    /*$scope.$on("leafletDirectiveMap.geojsonClick", function(ev, featureSelected, leafletEvent) {
      
      $rootScope.$emit('click on action', featureSelected)
    });*/
    
    /*$scope.$on('leafletDirectivePath.dblclick',function(ev, featureSelected, leafletEvent){
      var sectorName = featureSelected.pathName
      console.log(featureSelected)
    })*/

//	$scope.markers = $scope.addSectorMarkersToMap(sectors);
//	$scope.paths = $scope.addPointRadiusToMap(sectors, $scope);
//	$scope.paths["Yverdon"] = $scope.addYverdonLayer(yverdon.features[0].geometry.coordinates[0]);
//	$scope.setPlayerPosition();
//	$scope.addSectorLabels(sectors);
  
    
  })