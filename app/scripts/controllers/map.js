'use strict';

/**
 * @ngdoc function
 * @name deskappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the deskappApp
 */
angular.module('deskappApp')

  .controller('SectorDashboardCtrl', function ($scope, SectorService) {
    
    $scope.visible = true // init value
    
    $scope.closeDashboard = function(){
      $scope.visible = false
    }
    
  })


  .controller('ActionDashboardCtrl', function ($scope, SectorService) {
    
    $scope.visible = false // init value
    
    $scope.closeDashboard = function(){
      $scope.visible = false
    }
    
  })

  .controller('MapActionCtrl', function ($scope, leafletData, geolocation, SectorService) {
    
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
      
   		addSectorsPathToMap: function(sectors) {
          
          angular.forEach(sectors, function(value, key) {
            var sector = {}
            sector.type = 'polygon'
            //sector.layer = 'sectors'
            //sector.focus = false
            sector.clickable = false
            
            // STROKE
            sector.weight = 6
            sector.opacity = 1
            sector.color = 'green'
            
            sector.fill = true
            sector.fillColor = 'red'
            sector.fillOpacity = 0.8
            
            //sector.actionsPolygon = sectors[i].properties.actionsPolygon
            //sector.actionPoints = sectors[i].properties.actionsPoint
            /*sector.message = "<h3>Influence : "+sectors[i].properties.influence+"%</h3><p>Boss: "
                +sectors[i].properties.character.name+"</p>";*/
            
            
            sector.latlngs = []
            var polyPoints = value.geometry.coordinates[0]
            angular.forEach(polyPoints, function(value) {
              sector.latlngs.push({
                lat: value[1],
                lng: value[0]
              })
            })
            
            /*
            for (var x = latlngs.length - 1; x>= 0; x--) {
     					sector.latlngs[x] = {
     						lat: latlngs[x][1], lng: latlngs[x][0]
  	   				    }
     				};*/
            
            
            $scope.paths['sector'+key] = sector
            
          })
        },
      
        addSectorsGeoJSONToMap: function(sectors) {
          
          var data = {
            "type": "FeatureCollection",
            "features": [sectors]
          }
          console.log(data)
          $scope.geojson = {
            data: data,
            style: {
              fillColor: "green",
              weight: 2,
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.7
            }
          }
          
        }

	})
  
    
    //$scope.markers = $scope.addSectorMarkersToMap(SectorService.getSectors())
    
    SectorService.getSectors(function(data){
      console.log(data)
      //$scope.markers = $scope.addSectorMarkersToMap(data)
      //$scope.addSectorsPathToMap(data)
      $scope.addSectorsGeoJSONToMap(data)
      //console.log($scope.paths)
    })
    
    $scope.$on('leafletDirectivePath.dblclick',function(ev, featureSelected, leafletEvent){
      var sectorName = featureSelected.pathName
      console.log(featureSelected)
    })

//	$scope.markers = $scope.addSectorMarkersToMap(sectors);
//	$scope.paths = $scope.addPointRadiusToMap(sectors, $scope);
//	$scope.paths["Yverdon"] = $scope.addYverdonLayer(yverdon.features[0].geometry.coordinates[0]);
//	$scope.setPlayerPosition();
//	$scope.addSectorLabels(sectors);
  
    
  })



