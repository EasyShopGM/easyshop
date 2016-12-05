angular.module('starter.controllers', [])
    .controller('AppCtrl', function($sessionStorage, $state, $scope, $ionicModal, $timeout, $http) {
        // Form data for the login modal
        $scope.logout = function() {
            $sessionStorage.$reset();
            $state.go("main_page");
        }



    })

.controller('first', function($scope, $http) {

    $timeout(function() {
        window.location = "#/app/home";
    }, 3000);

})

.controller('Home', function($rootScope, $scope, $http, $location, $ionicPopup) {

    $scope.products = [{
        id: 1,
        market: 'carrefour',
        title: 'Juego de Jardín Café 3 Piezas Acero Verde',
        price: '$ 2.500,99',
        priceold: '$ 9.999,99',
        paymentplan: '5 cuotas s/interes',
        link: '/img/prod-1.jpg'
    }, {
        id: 2,
        market: 'coto',
        title: 'Juego de Jardín Café 3 Piezas Acero Rojo',
        price: '$ 3.800,52',
        priceold: '$ 9.999,99',
        paymentplan: '2 cuotas s/interes',
        link: '/img/prod-2.jpg'
    }, {
        id: 3,
        market: 'jumbo',
        title: 'Juego de Jardín Isabella 3 Piezas Eucaliptus',
        price: '$ 5.200,00',
        priceold: '$ 9.999,99',
        paymentplan: '1 cuotas s/interes',
        link: '/img/prod-3.jpg'
    }, {
        id: 4,
        market: 'disco',
        title: 'Juego de Jardín Amazonas 6 Piezas Acero',
        price: '$ 1.200,00',
        priceold: '$ 9.999,99',
        paymentplan: '18 cuotas s/interes',
        link: '/img/prod-4.jpg'
    }, {
        id: 5,
        market: 'carrefour',
        title: 'Juego de Jardín Balcony 3 Piezas Acacia',
        price: '$ 999,99',
        priceold: '$ 9.999,99',
        paymentplan: '6 cuotas s/interes',
        link: '/img/prod-5.jpg'
    }, {
        id: 6,
        market: 'carrefour',
        title: 'Juego de Jardín Talego 3 Piezas Resina de polipropileno',
        price: '$ 899,00',
        priceold: '$ 9.999,99',
        paymentplan: '3 cuotas s/interes',
        link: '/img/prod-6.jpg'
    }];
    
    

    
    
    $scope.addlist = function(product_) {
        $scope.data = {}
            
        if ($rootScope.userloged) {
                
            
            var url_ = product_.link;
            var myPopup = $ionicPopup.show({
                template: '<img src = ' + product_.link + ' style="width:50%; height:50%; margin:0% auto; display:block "> <p>Cantidad:<p/> <input type = "text" ng-model = "data.model">',
                title: product_.title,
                subTitle: product_.price,
                scope: $scope,

                buttons: [{
                    text: 'Cancelar'
                }, {
                    text: '<b>Confirmar</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.data.model) {
                            e.preventDefault();
                        }
                        else {
                            return $scope.data.model;
                        }
                    }
                }]
            });

        myPopup.then(function(product_) {
            console.log('Tapped!', product_);
        });    
    } else {
        var alertPopup = $ionicPopup.alert({
            title: 'EasyShop',
            template: '<img src = /img/alert.gif  style="width:10%; height:10%; margin-left:5%">  Debe estar autenticado.'
            
        });

        alertPopup.then(function(res) {
     
        });
    }
   };
   
   
    
})

.controller('shoppinglist', function($scope, $http, $location, $sessionStorage, $state) {
    
    $scope.items = [{
        id: 0
    }, {
        id: 1
    }, {
        id: 2
    }, {
        id: 3
    }, {
        id: 4
    }, {
        id: 5
    }];
    
    $scope.comprar = function() {
        console.log("compro");
    };
    
    $scope.eliminar = function(id_) {
        console.log("elimino" + id_);
    }
    
})

.controller('myorder', function($scope, $http, $location) {

    })
    .controller('productlist', function($scope, $http, $location) {

    })
    .controller('cart', function($scope, $http, $location) {

    })
    .controller('productdetail', function($scope, $http, $location) {

    })
    .controller('userprofile', function($state, $rootScope, $scope, $http, $location, $sessionStorage) {
        
        if ($sessionStorage.customdataloged) {
            
        } else {
            $rootScope.customdataloged = {foto:'/img/ios7-contact-outline.png'};
            $sessionStorage.customdataloged = $rootScope.customdataloged;
        }
    
        
        $scope.cancelar = function() {
            $state.go("app.home");
        }
    })
    .controller('login', function($state, $ionicLoading, $rootScope, $scope, $http, $location, SrvCallOauth, $sessionStorage, $ionicPopup, Base64) {

        if ($sessionStorage.userloged) {
            $state.go("app.home");
        }

        $scope.login = function() {
            //inicia el evento cargando y bloquea la pantalla
            $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner>'
            });
            var base64_login = Base64.encode($scope.user.username + ':' + $scope.user.password);
            var data_login = {
                'type': 'basic',
                'value': base64_login
            };

            SrvCallOauth.async(url_backend_oauth + AUTH, 'POST', data_login)
                .success(function(resp) {
                    //Apaga el evento cargando
                    $ionicLoading.hide();
                    $scope.userlogin(resp);
                })

            .error(function(resp) {
                //Apaga el evento cargando
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Ups!',
                    template: resp,
                    okText: 'OK!'
                });
            });
        }

        $scope.userlogin = function(userlogin_) {

            var strurl = userlogin_.account.href;
            var pathaccount = "/v1/accounts/";
            var pos = strurl.indexOf(pathaccount) + pathaccount.length;
            var token = strurl.substr(pos, (strurl.length - pos));

            SrvCallOauth.async(url_backend_oauth + AUTH_DATA + token, 'GET', '')
                .success(function(resp) {
                    $rootScope.userloged = resp;
                    $sessionStorage.userloged = $rootScope.userloged;
                    $sessionStorage.tokenloged = url_backend_oauth + AUTH_DATA + token;
                    $scope.customlogin(url_backend_oauth + AUTH_DATA + token + AUTH_DATA_CUSTOMDATA);
                    $state.go("app.home");
                })

            .error(function(resp) {
                //Apaga el evento cargando
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Ups!',
                    template: resp,
                    okText: 'OK!'
                });
            });
        }

        $scope.customlogin = function(customlogin_) {

            console.log(customlogin_);
            SrvCallOauth.async(customlogin_, 'GET', '')
                .success(function(resp) {
                    $rootScope.customdataloged = resp;
                    $sessionStorage.customdataloged = $rootScope.customdataloged;
                })
                .error(function(resp) {
                    //Apaga el evento cargando
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Ups!',
                        template: resp,
                        okText: 'OK!'
                    });
                });
        }

        $scope.cancelar = function() {
            $state.go("app.home");
        }


    })


.controller('register', function($state, $ionicLoading, $rootScope, $scope, $http, $location, SrvCallOauth, $sessionStorage, $ionicPopup) {


    $scope.register = function() {
        //inicia el evento cargando y bloquea la pantalla
        $ionicLoading.show({
            template: '<ion-spinner icon="android"></ion-spinner>'
        });

        SrvCallOauth.async(url_backend_oauth + REGISTER, 'POST', {
                'givenName': $scope.userRegister.firstName,
                'surname': $scope.userRegister.lastName,
                'username': $scope.userRegister.username,
                'email': $scope.userRegister.eMail,
                'password': $scope.userRegister.password,
                'customData': {
                    'favoriteColor': $scope.userRegister.favcolor,
                    'foto': 'https://www.gravatar.com/avatar/90c89a212acf87b6abe02937b388e740?s=32&d=retro'
                }
            })
            .success(function(resp) {

                console.log(resp)
                    //Apaga el evento cargando
                $ionicLoading.hide();
                $rootScope.userloged = resp;
                console.log($rootScope.userloged);
                $sessionStorage.userLoged = $rootScope.userloged;
                $state.go("app.home");

            }).error(function(resp) {

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

.controller('shipping', function($scope, $http, $location) {

})
