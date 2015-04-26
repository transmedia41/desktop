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

 .controller('SectorsCtrl', function ($scope, SocketService, SectorService) {

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

  })
 
 
  .controller('MapSectorCtrl', function ($scope, leafletData, geolocation) {
    
    var mapboxMapId =  "hydromerta.lpkj6fe5"
    var mapboxAccessToken = "pk.eyJ1IjoiaHlkcm9tZXJ0YSIsImEiOiJZTUlDdVA0In0.Z7qJF3weLg5WuPpzt6fMdA"
    var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken
    
    
    var body = angular.element.find("body");
    //var height = body.height();
  console.log(body[0].clientHeight)
  console.log(body)
  //console.log(height)f
  
    //$scope.heightMap = '500px'
    
	angular.extend($scope, {
	    defaults: {
          maxZoom: 18,
          minZoom: 14,
          attributionControl: false,
          tileLayer: mapboxTileLayer,
          zoomControlPosition: false
	    },
	    maxbounds : {
			    southWest: {
			        lat:46.749859206774524,
			        lng: 6.559438705444336
			    },
			    northEast: {
			       lat:46.8027621127906,
			       lng: 6.731100082397461
			    }
			},
	    mapCenter: {
	            lat: 46.78,
	            lng: 6.65,
	            zoom: 15
	          },
	   
	    markers :{
	    },
	    paths:{	    
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
		addSectorLabels: function(sectors){
			leafletData.getMap("map").then(function(map){
				leafletData.getPaths().then(function(paths){
					for (var i = sectors.length - 1; i >= 0; i--) {
						var title = sectors[i].properties.nomsquart;
						var sector = paths["sector"+i];
				 		
						//console.log(sector)
						//console.log(center)
						var labelLocation = new L.LatLng(51.329219337279405, 10.454119349999928);
					};
					var labelTitle = new L.LabelOverlay(labelLocation, '<b>'+title+'</b>');
					map.addLayer(labelTitle);
				})
				
			});	
		},
   		addSectorMarkersToMap: function(sectors){
			var sectorPoints = [];
			var indexPoint= 0;
			for (var i = sectors.length - 1; i >= 0; i--) {
				indexPoint = indexPoint+ sectors[i].properties.actionsPoint.length;
			};

			for (var i = sectors.length - 1; i >= 0; i--) {
				if (sectors[i].properties.actionsPoint) {


				for (var j = sectors[i].properties.actionsPoint.length - 1; j >= 0; j--) {
					var marker = {};

					var point = sectors[i].properties.actionsPoint[j];
					var lng = point.geometry.coordinates[0];
					var lat = point.geometry.coordinates[1];
					marker.layer = 'markers';
					marker.lat = lat;
					marker.lng = lng;
					marker.name = point.properties.type;

					if (point.properties.type=="Player") {
						marker.icon = playerIcon;
					}else{
						marker.icon = markerIcon
					}if (point.properties.type.toUpperCase() == "FONTAINE") {
						marker.icon = fontaineIcon
					};
					if (point.properties.type.toUpperCase()== "ARROSAGE") {
						marker.icon = arrosageIcon
					};
					if (point.properties.type.toUpperCase()  == "WC PUBLIC") {
						marker.icon = wcIcon
					};
					if (point.properties.type.toUpperCase() == "AFFICHE") {
						marker.icon = afficheIcon
					};
					var text = "cercle "+indexPoint+ " //"+ point.properties.type + " appartient à "+ sectors[i].properties.nomsquart + " radius "+ point.properties.actionRadius
					marker.message = text;
					sectorPoints.push(marker)
					indexPoint--;
				};
				
			};
			};

			return sectorPoints;
		},
   		addPointRadiusToMap: function(sectors){
   			var shapess = []
   			var shapes = {};
   			var circles = {};
   			var polygons = {}
  			//get total number of points to draw the circles
  			var totalCircles= 0;
  			for (var i = sectors.length - 1; i >= 0; i--) {
  				totalCircles = totalCircles+ sectors[i].properties.actionsPoint.length;
  			};
  			//set the sectors
  			//message label?
  			//geojson same?? style individuel??
  			//label a part??
  			//colors change 
  			for (var i = sectors.length - 1; i >= 0; i--) {
  				var influence = sectors[i].properties.influence;
     				var sector = {};
     				var latlngs = [];
     				sector.latlngs = [];

     				sector.type = "polygon";
     				sector.layer = 'sectors';
     				sector.focus = true;
     				sector.clickable = true;
     				sector.weight = 3;	
     				sector.actionsPolygon = sectors[i].properties.actionsPolygon
     				sector.actionPoints = sectors[i].properties.actionsPoint
     				sector.message = "<h3>Influence : "+sectors[i].properties.influence+"%</h3><p>Boss: "
     					+sectors[i].properties.character.name+"</p>";
     				sector.color = $scope.sectorColor(influence);	

     				latlngs = sectors[i].geometry.coordinates[0]
     				//set all the coordinates
     				for (var x = latlngs.length - 1; x>= 0; x--) {
     					sector.latlngs[x] = {
     						lat: latlngs[x][1], lng: latlngs[x][0]
  	   				    }
     				};
     				shapes["sector"+i] = sector;
  	   			//set the circle radius
  				for (var j = sectors[i].properties.actionsPoint.length - 1; j >= 0; j--) {
  					var circle = {};
  					var point = sectors[i].properties.actionsPoint[j];
  					var lng = point.geometry.coordinates[0];
  					var lat = point.geometry.coordinates[1];

  					circle = {
  						type : "circle",
  						layer : 'circles',
  						dashArray : "7,10",
  						clickable : false,
  						radius : point.properties.actionRadius,
  						latlngs : {
  									lat: lat,
  									lng: lng
  								  },
  						color : 'green',
  						weight : 2
  					}
  					shapes["circle"+totalCircles] = circle;
  		
  					totalCircles--;
  				};
  			};

  			return shapes;
   		},
   		isMarkerInCircles:function(marker, sectors, circles){
   			var isIn = [];
   			var totalCircles = 0;
  			var isInCircle = false;
  			//total circles
  			for (var i = sectors.length - 1; i >= 0; i--) {
  				totalCircles = totalCircles+ sectors[i].properties.actionsPoint.length;
  			};
  			// check what circles is the marker in
  			for (var i = 1; i < totalCircles; i++) {
  				isInCircle = geolib.isPointInCircle(
  					{latitude: marker.lat, longitude: marker.lng},
  					{latitude: circles["circle"+i].latlngs.lat, longitude:circles["circle"+i].latlngs.lng},
  					circles["circle"+i].radius
  				);
  				if (isInCircle) {
  					isIn.push(i);
  				}				
  			};
  			return isIn;
   		},
   		sectorColor:function(influence){
   			if (influence <=20) {
   					return "orange";
   					   					
   				}else if(influence>20  && influence<=40){
   					return "green"
   				}
   				else if(influence >= 41 && influence <=60){
   					return  "red"
   				}
   				else if(influence>60 && influence<=80){
   					return  "black"
   				}
   				else if(influence >80){
   					return "blue"
   				}	
   		},
   		changeMarkerColor: function(color){
     		if(color == 'green'){
  				return 'red';
  			}if(color=="red"){
  				return 'orange'
  			}if (color=="orange") {
  				return "green";
  			};
   		},
   		setPlayerPosition:function(){
   			geolocation.getLocation().then(function(data){
		      $scope.coords = {lat:data.coords.latitude, long:data.coords.longitude};
	   					var player  = {"type":"Feature","geometry":{"type":"Point","coordinates":[0,0]},"properties":{"actionRadius":1,"type":"Player"}}
	   					player.lat = $scope.coords.lat;
	   				    player.lng = $scope.coords.long;
	   				    player.icon = playerIcon;
	   				    $scope.markers.push(player);
		    });   			
   		},
   		getPlayer:function(){
   			for (var i = $scope.markers.length - 1; i >= 0; i--) {
	   				if ($scope.markers[i].name == "Player"){
	   					return $scope.markers[i]
	   				}
   				};
   		},
   		getSectorActions:function(name){
   			console.log($scope.paths[name].actionsPolygon)
   		},
   		isMarkerInSector:function(player,sectors){
   			for (var i = sectors.length - 1; i >= 0; i--) {

   			};
   		},
   		layersVisibility:function(){
   			leafletData.getMap("map").then(function(map){ 
	    		var zoom = map.getZoom();
	    		//whole yverdon
	    		if (zoom == 14) {
	    			$scope.layers.overlays.yverdon.visible = true;
	    			$scope.layers.overlays.sectors.visible = false;
	    		}else{
	    			$scope.layers.overlays.yverdon.visible = false;
	    			$scope.layers.overlays.sectors.visible = true;
	    		};
	    		//markers visibility
	    		if (zoom <= 15) {
	    			$scope.layers.overlays.markers.visible = false;
	    		}else{
	    			$scope.layers.overlays.markers.visible = true;
	    		};
	    		//circles visibility
	    		if (zoom <= 16) {
	    			$scope.layers.overlays.circles.visible = false;
	    		}else{
	    			$scope.layers.overlays.circles.visible = true;
	    		};
	    	})	
   		},
   		addYverdonLayer: function(yverdon){
   			
   			var Yverdon = {};
   			Yverdon.color = "red";
   			Yverdon.type = "polygon";
   			Yverdon.layer = 'yverdon';
   			Yverdon.weight = 3;
   			Yverdon.latlngs = [];
   			var latlngs =yverdon[0];
   			for (var i = latlngs.length - 1; i >= 0; i--) {
   				Yverdon.latlngs[i]= {
   					lat: latlngs[i][1], lng: latlngs[i][0]
   				}
   			};
   			return Yverdon;
   		}

	});


//	$scope.markers = $scope.addSectorMarkersToMap(sectors);
//	$scope.paths = $scope.addPointRadiusToMap(sectors, $scope);
//	$scope.paths["Yverdon"] = $scope.addYverdonLayer(yverdon.features[0].geometry.coordinates[0]);
//	$scope.setPlayerPosition();
//	$scope.addSectorLabels(sectors);
	////DIRECTIVES////
	/*
		// MARKER CLICK
		 $scope.$on('leafletDirectiveMarker.click', function(ev, featureSelected, leafletEvent) {
 			var markerIndex = featureSelected.markerName;
 			var player = $scope.markers[markerIndex];
 			var circleIds = $scope.isMarkerInCircles(featureSelected.leafletEvent.latlng, sectors, $scope.paths);
 			var sectorId = $scope.isMarkerInSector($scope.markers[0], sectors);
 			//$scope.getSectorActions(circleIds);
 			console.log(featureSelected.leafletEvent.latlng);
 			console.log(circleIds)
	    });
		//MARKER MOUSEOVER
		$scope.$on('leafletDirectiveMarker.mouseover', function(ev, featureSelected, leafletEvent) {
					featureSelected.leafletEvent.target.openPopup();
		});
		//MARKER MOUSEOUT
		$scope.$on('leafletDirectiveMarker.mouseout', function(ev, featureSelected, leafletEvent) {
					featureSelected.leafletEvent.target.closePopup();
		});
	    //SECTOR CLICK
	    $scope.$on('leafletDirectivePath.mousedown',function(ev, featureSelected, leafletEvent){
	    	var sectorName = featureSelected.pathName;
	    	$scope.getSectorActions(sectorName);
	    })
	    //ON MAP ZOOM
	    $scope.$on("leafletDirectiveMap.zoomend",function(ev, featureSelected, leafletEvent){
	    	$scope.layersVisibility();  	
	    })
	    //PATHS MOUSEMOVE
	    $scope.$on("leafletDirectivePath.mouseover",function(ev,featureSelected,leafletEvent){
			
	    })*/
    
    var markerIcon = {
        type : "extraMarker",
        icon: "fa-coffee",
        markerColor: 'green',
        prefix: "fa",
        layer: 'cars',
        shape: 'square',
        imgHeight: 30,
        imgWidth : 30        
    }
    var playerIcon = {
        type : "extraMarker",
        iconImg: "img/dick.png",
        markerColor: 'orange',
        prefix: "fa",
        shape: 'square',
        imgHeight: 30,
        imgWidth : 30        
    }
    var fontaineIcon = {
        type : "extraMarker",
        markerColor: 'red',
        icon: "fa-star",
        prefix: "fa",
        shape: 'square',
        imgHeight: 30,

        imgWidth : 30        
    }
    var arrosageIcon = {
        type : "extraMarker",
        markerColor: 'yellow',
        icon: "fa-calculator",
        prefix: "fa",
        shape: 'square',
        imgHeight: 30,
        imgWidth : 30        
    }
    var wcIcon = {
        type : "extraMarker",
        markerColor: 'blue',
        icon: "fa-calculator",
        prefix: "fa",
        shape: 'square',
        imgHeight: 30,
        imgWidth : 30        
    }
    var afficheIcon = {
        type : "extraMarker",
        markerColor: 'black',
        icon: "fa-calculator",
        prefix: "fa",
        shape: 'square',
        imgHeight: 30,
        imgWidth : 30        
    }

})// MAP CONTROLLER

