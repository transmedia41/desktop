'use strict';

/**
 * @ngdoc function
 * @name deskappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the deskappApp
 */
 angular.module('deskappApp')


 .controller('MafiaCtrl', function ($scope) {

  $scope.showDesc = true
  $scope.showDescNotAvaible = true



   $scope.showMafiosiContent = function(character){
    console.log(character)

    //$scope.isDisabled = true;
    //return false;

    if (!character.characterAvaible){
      console.log('disable')

    $scope.desc_lastname = 'No name'
    $scope.desc_status = 'No status'
    $scope.desc_firstname = 'no life'
    $scope.showDesc = true
    $scope.showDescNotAvaible = false
  

    } else {

    $scope.desc_avaible = character.characterAvaible
    $scope.showDescNotAvaible = true
    $scope.showDesc = false
    $scope.desc_lastname = character.lastname
    $scope.desc_status = character.status
    $scope.desc_firstname = character.firstname
    $scope.desc_nickname = character.nickname
    $scope.desc_life = character.life
    $scope.desc_personality = character.personality
    $scope.desc_twitch = character.twitch
    $scope.desc_vice = character.vice
    $scope.desc_drink = character.drink
    $scope.desc_strength = character.strength
    $scope.desc_weakness = character.weaknes
    $scope.desc_distinctive = character.distinctive
    $scope.desc_body = character.body
    $scope.desc_family = character.family
    $scope.desc_weapon = character.weapon
     }

   }





   $scope.characterList = [
   {
    id: 1,
    characterAvaible: false,
    status: 'Boss',
    lastname: 'Mongo',
    firstname: 'Salvatore',
    nickname: 'pseudoLatte',
    life: 'desc',
    personality: 'strong',
    twitch: 'twitch',
    vice: 'vice',
    drink: 'vodka',
    strength: 'fort',
    weakness: 'weakkness',
    distinctive: 'poulet',
    body: 'body',
    family: 'sanchez',
    weapon: 'couteau'
  },
  {
    id: 2,
    characterAvaible: false,
    status: 'Soldat',
    lastname: 'Postgres',
    firstname: 'Alessandra',
    nickname: 'mouarf',
    life: 'desc',
    personality: 'strong',
    twitch: 'twitch',
    vice: 'vice',
    drink: 'vodka',
    strength: 'fort',
    weakness: 'weakkness',
    distinctive: 'poulet',
    body: 'body',
    family: 'sanchez',
    weapon: 'couteau'
  }
  ,
  {
    id: 3,
    status: 'Conseillere',
    characterAvaible: true,
    lastname: 'Rene',
    firstname: 'Lucas',
    nickname: 'mouarf',
   life: 'desc',
    personality: 'strong',
    twitch: 'twitch',
    vice: 'vice',
    drink: 'vodka',
    strength: 'fort',
    weakness: 'weakkness',
    distinctive: 'poulet',
    body: 'body',
    family: 'sanchez',
    weapon: 'couteau'
  },
  {
    id: 4,
    status: 'Associe',
    characterAvaible: false,
    lastname: 'René',
    firstname: 'Lucas',
    nickname: 'mouarf',
   life: 'desc',
    personality: 'strong',
    twitch: 'twitch',
    vice: 'vice',
    drink: 'vodka',
    strength: 'fort',
    weakness: 'weakkness',
    distinctive: 'poulet',
    body: 'body',
    family: 'sanchez',
    weapon: 'couteau'
  },
  {
    id: 5,
    status: 'Chat',
    characterAvaible: true,
    lastname: 'René',
    firstname: 'Lucas',
    nickname: 'mouarf',
   life: 'desc',
    personality: 'strong',
    twitch: 'twitch',
    vice: 'vice',
    drink: 'vodka',
    strength: 'fort',
    weakness: 'weakkness',
    distinctive: 'poulet',
    body: 'body',
    family: 'sanchez',
    weapon: 'couteau'
  }

  ]// \.CharacterList



})

//Filtre de recherche en fonction du 'firstname'
/*
.filter('character', function(){
  return function(input, name){
    var out = []
    angular.forEach(input, function(character){
      if(character.firstname === name){
        out.push(character)
      }
    })

    if(out.length === 0){

      out = []
      return out

    }else {  
      return out     
    }
    return out

  }
})
*/









