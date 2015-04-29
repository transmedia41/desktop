'use strict';

var egoutIcon = {
    type : "extraMarker",
    extraClasses : "icon-bouche_egout"       
}
 var toiletteIcon = {
    type : "extraMarker",
    extraClasses : "icon-toilettes" 

}
 var afficheIcon = {
    type : "extraMarker",
    extraClasses : "icon-affiche" 

}
 var arrosageIcon = {
    type : "extraMarker",
    extraClasses : "icon-arrosage"       
}
var fontaineIcon = {
   type : "extraMarker",
    extraClasses: 'icon-fontaine'  
}
var hydranteIcon = {
    type : "extraMarker",   
    extraClasses: 'icon-hydrante'

}

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


  .controller('ActionDashboardCtrl', function ($scope, $rootScope, SectorService, GameCoreService) {
    
    $scope.visible = false
    
    $scope.closeDashboard = function(){
      $scope.visible = false
    }
    
    $rootScope.$on('click on marker', function(e, featureSelected){
      $scope.visible = true
      $scope.markerSelected = featureSelected
      $scope.markerSelected.expectedDrop = GameCoreService.getExpectedDrop(featureSelected.properties, featureSelected.sector)
    })
    
  })

  .controller('MapActionCtrl', function ($scope, $rootScope, leafletData, geolocation, SectorService, Config) {
    
    var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + Config.mapboxMapId + "/{z}/{x}/{y}.png?access_token=" + Config.mapboxAccessToken
    
    
	angular.extend($scope, {
      
      defaults: {
        maxZoom: 18,
        minZoom: 15,
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

         markerColor:function(cooldown){
          // lastperformed+coooldown > date.now()
          if (cooldown <=600) {
            return '../images/green.png';
          }else{
            return '../images/grey.png';
          };

        },

      addMarkersToMap : function(points){
           var markers= []
           angular.forEach(points,function(point,index){
            var marker = {
              lat : point.geometry.coordinates[1],
              lng : point.geometry.coordinates[0],
              properties : point.properties,
              
            }
          
            if (point.properties.type == "hydrante") {
              marker.icon = hydranteIcon
            };
            if (point.properties.type.toLowerCase() == "fontaine") {
              marker.icon = fontaineIcon
            };
            if (point.properties.type == "arrosage") {
              marker.icon = arrosageIcon
            };
            if (point.properties.type == "affiche") {
              marker.icon = afficheIcon
            };
            if (point.properties.type == "toilettes") {
              marker.icon = toiletteIcon
            };
            if (point.properties.type == "bouche_egout") {
              marker.icon = egoutIcon
            };
            if (point.properties.type == "dechet_lac") {
              marker.icon = dechetIcon
            };
            marker.icon.iconImg = $scope.markerColor(point.properties.coolDown)
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