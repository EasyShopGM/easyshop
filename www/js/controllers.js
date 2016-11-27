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
.controller('userprofile', function ($scope, $http,$location) {
 
})
.controller('login', function ($state, $ionicLoading, $rootScope, $scope, $http, $location, SrvCallOauth, $sessionStorage) {
 
 if($sessionStorage.userLoged){
      $state.go("app.home");
 }
 
 $scope.login = function(){
      //inicia el evento cargando y bloquea la pantalla
    $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner>'
    }); 
    
    //SrvCall.async('dummys/login.json', 'GET', '').success(function(resp) {
    SrvCallOauth.async(url_backend_oauth + AUTH, 'GET', '').success(function(resp) {
     console.log(resp)
     console.log(resp.items[0].username)
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

.controller('register', function ($state, $ionicLoading, $rootScope, $scope, $http, $location, SrvCallOauth, $sessionStorage, $ionicPopup) {
 
 
 $scope.register = function(){
      //inicia el evento cargando y bloquea la pantalla
    $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner>'
    }); 
    
    SrvCallOauth.async(url_backend_oauth + REGISTER, 'POST', {'givenName': $scope.userRegister.firstName, 'surname': $scope.userRegister.lastName, 'username': $scope.userRegister.username,'email': $scope.userRegister.eMail,'password':$scope.userRegister.password, 'customData': {'favoriteColor': $scope.userRegister.favcolor, 'foto': 'https://www.gravatar.com/avatar/90c89a212acf87b6abe02937b388e740?s=32&d=retro'}})
    .success(function(resp) {
        
        console.log(resp)
        //Apaga el evento cargando
        $ionicLoading.hide();
        $rootScope.userLoged = resp;
        console.log($rootScope.userLoged);
        $sessionStorage.userLoged = $rootScope.userLoged;
        $state.go("app.home");
        
    }).error(function(resp){
        
        console.log(resp)
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










