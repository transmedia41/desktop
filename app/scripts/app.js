'use strict';

/**
 * @ngdoc overview
 * @name deskappApp
 * @description
 * # deskappApp
 *
 * Main module of the application.
 */
angular
  .module('deskappApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'LocalStorageModule',
    'angular.directives-round-progress',
    'leaflet-directive',
    'geolocation',
    'ngProgress',
    'bootstrapLightbox',
    'ui.bootstrap'
  ])


  /**
   * Configuration des constantes de l'application
   * 
   */
  .constant('Config', {
    API_URL: 'http://localhost:3000/',
    //API_URL: 'http://hydromerta.comem.ch/backend/',
    mapboxMapId:  'hydromerta.lpkj6fe5',
    mapboxAccessToken: 'pk.eyJ1IjoiaHlkcm9tZXJ0YSIsImEiOiJZTUlDdVA0In0.Z7qJF3weLg5WuPpzt6fMdA'
  })


  /**
   * Configuration des URLs de l'application et de leur template.
   * 
   */
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'MainCtrl'
      })
      .when('/tactic', {
        templateUrl: 'views/tactic.html',
        controller: 'MainSectorsCtrl'
      })
      .when('/actions', {
        templateUrl: 'views/actions.html',
        controller: 'MainActionsCtrl'
      })
      .when('/documents', {
        templateUrl: 'views/documents.html',
        controller: 'MainDocumentsCtrl'
      })
      .when('/mafia', {
        templateUrl: 'views/mafia.html',
        controller: 'MainMafiaCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })


  /**
   * Modification des headers par défault du $httpProvider pour authorisé
   * le cross domaine.
   * 
   */
  .config(function ($httpProvider) {
    $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
    $httpProvider.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type, X-Requested-With'
  })


  /**
   * Configure la bare de chargement par défaut pour toute l'application
   * 
   */
  .run(function (ngProgress) {
    ngProgress.color('#eeece1')
    ngProgress.height(3)
  })


  /**
   * Service mettant à disposition la connexion websocket de l'application.
   * Le service se charge d'initier la connection avec la fonction 'connection'
   * et permet de récuperer la socket avec 'getSocket'.
   * Le service enregistre authomatiquement le JWT (token) dans le
   * local storage si la connexion est valide et le supprime lors de la
   * deconnexion.
   * 
   */
  .service('SocketService', function($rootScope, localStorageService, Config){
    
    var socket
  
    var socketService = {
    
      connect: function(t){
        if(localStorageService.isSupported) {
          localStorageService.set('wstoken', t)
          socket = io.connect(Config.API_URL, {
            query: 'token=' + t,
            'force new connection': true
          }).on('connect', function () {
            $rootScope.$emit('connection')
            socket.emit('get user')
            socket.on('user responce', function(data){
              $rootScope.$emit('user responce', data)
            })
            socket.on('user responce 404', function(){
              console.log('user responce 404')
            })
          }).on('disconnect', function () {
            socket.close()
            if(localStorageService.isSupported) {
              localStorageService.remove('wstoken')
            }
            $rootScope.$emit('disconnected')
          }).on("error", function(error) {
            if (error.type == "UnauthorizedError" || error.code == "invalid_token") {
              $rootScope.$emit('invalide token')
            } else {
              $rootScope.$emit('error token')
            }
          })
          return socket
        }
      },
      
      getSocket: function() {
        return socket
      }
    
    }
    return socketService
    
  })


  /**
   * Vérifie si un token est enregistrer dans le local storage.
   * Si c'est le cas on tente une connexion au websocket avec ce
   * token.
   * 
   */
  .run(function (localStorageService, SocketService) {
    if(localStorageService.isSupported) {
      var t = localStorageService.get('wstoken')
      if(t){
        SocketService.connect(t)
      }
    }
  })


  /**
   * Vérifie à chaque changement de page si le tocken est enregister
   * dans le local storage. Si il est précent on part du principe qu'il
   * est authentifié.
   * S'il n'est pas présent on redirige vers la racine du site
   * 
   */
  .run(function ($rootScope, $location, localStorageService) {
    $rootScope.$on('$routeChangeStart', function (event) {
      if(localStorageService.isSupported) {
        var t = localStorageService.get('wstoken')
        if(!t){
          console.log('not autorized')
          $location.path('/')
        } else {
          console.log('autorized', $location.path())
          switch($location.path()) {
            case '/actions':
              localStorageService.set('currentPage', '/actions')
              $rootScope.$emit('update navbar')
              break;
            case '/tactic':
              localStorageService.set('currentPage', '/tactic')
              $rootScope.$emit('update navbar')
              break;
            case '/documents':
              localStorageService.set('currentPage', '/documents')
              $rootScope.$emit('update navbar')
              break;
            case '/mafia':
              localStorageService.set('currentPage', '/mafia')
              $rootScope.$emit('update navbar')
              break;
          }
        }
      } else {
        $rootScope.$emit('localstorage not supported')
      }
    })
  })


  /**
   * Ecoute les événements Auth qui sont lancer sur le rootScope
   * 
   */
  .run(function ($rootScope, $location, localStorageService) {
    $rootScope.$on('connection', function (event) {
      console.log('connection')
      $rootScope.gameBar = true
      //$location.path('/actions')
    })
    $rootScope.$on('register', function (event) {
      console.log('register')
      // ... do something
    })
    $rootScope.$on('disconnected', function (event) {
      console.log('disconnected')
      localStorageService.set('last disconnect', Date.now())
      $rootScope.gameBar = false
      localStorageService.remove('currentPage')
      $location.path('/')
    })
  })


  /**
   * Service qui distribue les données de secteur pour toute l'application.
   * Le service stock dans le local storage les données pour minimiser les apples
   * au web service.
   * 
   */
  .service('SectorService', function($rootScope, localStorageService, SocketService){

    var sectors = []
    
    $rootScope.$on('connection', function (e) {
      SocketService.getSocket().on('action polygon performed', function(data){
        //console.log(data)
        remplaceSector(data)
        $rootScope.$emit('new sector available')
      })
    })
    
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
        SocketService.getSocket().on('update sectors influence', function(data){
          remplaceAllSector(data)
          $rootScope.$emit('new sector available')
        })
    }
  
    function remplaceSector(newSector) {
      angular.forEach(sectors, function(oldSector, key) {
        if(oldSector.id == newSector.id) {
          sectors[key] = newSector
        }
      })
      localStorageService.set('sectors', sectors)
      localStorageService.set('last update sectors', Date.now())
    }
    
    function remplaceAllSector(newSectors) {
      sectors = newSectors
      localStorageService.set('sectors', sectors)
      localStorageService.set('last update sectors', Date.now())
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
      getSectorsLocal: function(callback) {
        callback(sectors)
      },
      getActionPoint: function() {
        var actionPoint = []
        angular.forEach(sectors, function(sector, key) {
          angular.forEach(sector.properties.actionsPoint, function(point) {
            var cpy = {}
            cpy.id = sector.id
            cpy.influence = sector.properties.influence
            point.sector = cpy
            actionPoint.push(point)
          })
        })
        return actionPoint
      }
    }
    return service

  })


  /**
   * Controleur logique pour certaine partie du jeu
   * 
   */
  .controller('GameCoreCtrl', function ($scope, $rootScope, SectorService) {

    $rootScope.$on('connection', function (event) {
      SectorService.getSectors(function(data){
        $rootScope.$emit('sector available')
      })
    })

  })


  /**
   * Service qui fourni les methodes de calcule du jeu
   * 
   */
  .service('GameCoreService', function(){

    var core = {
      getExpectedDrop: function (action, sector) {
        return 1
      }
    }
    return core

  })


  /**
   * Rajoute des fonctionnalite au rootScope
   * Next step: créé un service pour le player
   * 
   */
  .run(function ($rootScope) {
    angular.extend($rootScope, {
      getNbActionPerformed: function(theId) {
        var actionPerformedInTheSector = 0
        angular.forEach($rootScope.playerInfos.sectors, function(sector){
          if(sector.sector_id == theId) {
            actionPerformedInTheSector = sector.actionsPerformed
          }
        })
        return actionPerformedInTheSector
      },
      isSectorActionPerformed: function(theId, actionToPerformed) {
        var sectorIsDebloced = false
        angular.forEach($rootScope.playerInfos.sectors, function(sector){
          if(sector.sector_id == theId && sector.actionsPerformed >= actionToPerformed) {
            sectorIsDebloced = true
          }
        })
        return sectorIsDebloced
      }
    })
  })





