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
    'LocalStorageModule'
  ])


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
        controller: 'SectorsCtrl'
      })
      .when('/actions', {
        templateUrl: 'views/actions.html',
        controller: 'ActionsCtrl'
      })
      .when('/documents', {
        templateUrl: 'views/documents.html',
        controller: 'DocumentsCtrl'
      })
      .when('/mafia', {
        templateUrl: 'views/mafia.html',
        controller: 'MafiaCtrl'
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
   * Service mettant à disposition la connexion websocket de l'application.
   * Le service se charge d'initier la connection avec la fonction 'connection'
   * et permet de récuperer la socket avec 'getSocket'.
   * Le service enregistre authomatiquement le JWT (token) dans le
   * local storage si la connexion est valide et le supprime lors de la
   * deconnexion.
   * 
   */
  .service('SocketService', function($rootScope, localStorageService){
    
    var socket
  
    var socketService = {
    
      connect: function(t){
        if(localStorageService.isSupported) {
          localStorageService.set('wstoken', t)
          socket = io.connect('http://localhost:3000/', {
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
          console.log('autorized')
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
  .run(function ($rootScope, $location) {
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
      $location.path('/')
    })
  })



