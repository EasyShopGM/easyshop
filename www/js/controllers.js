angular.module('starter.controllers', [])
.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $http) {
    // Form data for the login modal
	
})

.controller('logout', function ($scope, $http) {

 window.localStorage.clear();
    window.location = "#/login/login";

})
.controller('first', function ($scope, $http) {

$timeout( function(){ window.location = "#/app/home"; }, 3000);
  
})

.controller('Home', function ($scope, $http,$location) {
  	
})
.controller('orderdetail', function ($scope, $http,$location) {
  	
})

.controller('myorder', function ($scope, $http,$location) {
  	
})
.controller('productlist', function ($scope, $http,$location) {
 
})
.controller('cart', function ($scope, $http,$location) {
 
})
.controller('productdetail', function ($scope, $http,$location) {
 
})
.controller('playlists', function ($scope, $http,$location) {
 
})
.controller('login', function ($state, $ionicLoading, $rootScope, $scope, $http, $location, SrvCall, $sessionStorage) {
 
 if($sessionStorage.userLoged){
      $state.go("app.home");
 }
 
 $scope.login = function(){
      //inicia el evento cargando y bloquea la pantalla
    $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner>'
    }); 
    
    //SrvCall.async('dummys/login.json', 'GET', '').success(function(resp) {
    SrvCall.async('https://api.stormpath.com/v1/accounts/3bmLIdu6nbCEO7EzpxipZb', 'GET', '').success(function(resp) {
     //console.log(resp)
     //Apaga el evento cargando
     $ionicLoading.hide();
     $rootScope.userLoged = resp.user;
     $sessionStorage.userLoged = $rootScope.userLoged;
     $state.go("app.home");
     
     }).error(function(resp){
            //Apaga el evento cargando
            $ionicLoading.hide();
                $ionicPopup.alert({
                        title: 'Ups!',
                        template: resp,
                        okText: 'OK!'
                });     
    });
 }
 
})

.controller('register', function ($state, $ionicLoading, $rootScope, $scope, $http, $location, SrvCall, $sessionStorage, $ionicPopup) {
 
 $scope.register = function(){
      //inicia el evento cargando y bloquea la pantalla
    $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner>'
    }); 
    SrvCall.async('http://3BS3FAEHJ7A2PDFQPXDMNR8IC:S37xox/5wZxoBReqGuuBoVFXETJMXhcmgTT3tZ96ygA@api.stormpath.com/v1/applications/4EYncfTJgPkfPquDYKbBM/accounts', 'POST', '{\n    \"givenName\": \"Joe\",\n    \"surname\": \"Stormtrooper\",\n    \"username\": \"tk421\",\n    \"email\": \"tk421@stormpath.com\",\n    \"password\":\"Changeme1\",\n    \"customData\": {\n      \"favoriteColor\": \"white\"\n    }\n  }').success(function(resp) {
     //console.log(resp)
     //Apaga el evento cargando
     $ionicLoading.hide();
     $rootScope.userLoged = resp.userRegister;
     $sessionStorage.userLoged = $rootScope.userLoged;
     $state.go("app.home");
     
     }).error(function(resp){
            //Apaga el evento cargando
            $ionicLoading.hide();
                $ionicPopup.alert({
                        title: 'Ups!',
                        template: resp,
                        okText: 'OK!'
                });     
    });
 } 
})
.controller('shipping', function ($scope, $http,$location) {
 
})










