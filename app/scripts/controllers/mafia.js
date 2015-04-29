'use strict';
angular.module('deskappApp')
	.controller('MainMafiaCtrl', function($scope) {
	//...
	})
	.service('CharacterService', function($rootScope, SocketService) {
		var characters = []
		var service = {
			getCharacters: function(callback) {
				SocketService.getSocket().emit('get my characters').on('my characters responce', function(data) {
					characters = data
					callback(data)
				})
			},
			getCharactersLocal: function() {
				return characters
			}
		}
		return service
	})
	.controller('MafiaCtrl', function($scope, CharacterService, Config, SocketService) {
		$scope.showDesc = false
		$scope.desc_available = false
		$scope.active = []
		CharacterService.getCharacters(function(data) {
			console.log(data)
			$scope.characters = data
			$scope.$apply()
		})
		$scope.showMafiosiContent = function(character) {
                        // TODO : changer l'attribut du mafiosi yetvisited en yes
                        if(!character.yetVisited) {
                          SocketService.getSocket().emit('character vu', character.id)
                          $scope.apply()
                        }
			$scope.active = []
			$scope.active[character.char_id - 1] = 'active'
			$scope.locked = null;
			$scope.showDesc = true;
			if (!character.available) $scope.locked = "locked"
			$scope.desc_available = character.available
			$scope.showDescNotAvaible = true
			$scope.desc_lastname = character.lastname
			$scope.desc_status = character.status
			$scope.desc_firstname = character.firstname
			$scope.desc_nickname = character.nickname
			$scope.desc_portrait = Config.API_URL+character.portrait
			$scope.desc_life = character.life
			$scope.desc_personality = character.personality
			$scope.desc_twitch = character.twitch
			$scope.desc_vice = character.vice
			$scope.desc_drink = character.drink
			$scope.desc_strength = character.strength
			$scope.desc_weakness = character.weakness
			$scope.desc_distinctive = character.distinctive
			$scope.desc_body = character.body
			$scope.desc_family = character.family
			$scope.desc_weapon = character.weapon
		}
	})