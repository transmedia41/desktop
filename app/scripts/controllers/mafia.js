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
   


  $scope.showMafiosiContent = function(character){
      console.log(character)
      

      $scope.imgGD_title = doc.title
      $scope.imgGD_link = doc.versionUrl
     //Show / hide document right
  
  }





$scope.characterList = [
 {
    status: 'Boss',
    lastname: 'Mongo',
    firstname: 'vinzenzo',
    nickname: 'pseudoLatte',
    //life: String,
    //personality: String,
    //twitch: String,
    //vice: String,
    drink: 'vodka',
    //strength: String,
    //weakness: String,
    //distinctive: String,
    //body: String,
    //family: String,
    //weapon: String
},
 {
    status: 'Boss',
    lastname: 'Postgres',
    firstname: 'Paolo',
    nickname: 'mouarf',
    //life: String,
    //personality: String,
    //twitch: String,
    //vice: String,
    drink: 'vodka',
    //strength: String,
    //weakness: String,
    //distinctive: String,
    //body: String,
    //family: String,
    //weapon: String
}
,
 {
    status: 'Boss',
    lastname: 'Postgres',
    firstname: 'Samanta',
    nickname: 'mouarf',
    //life: String,
    //personality: String,
    //twitch: String,
    //vice: String,
    drink: 'vodka',
    //strength: String,
    //weakness: String,
    //distinctive: String,
    //body: String,
    //family: String,
    //weapon: String
}
  ]// \.CharacterList





})

//Filtre de recherche en fonction du "firstname"
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
      console.log(out[0])
        return out     
    }
      return out

  }
})









