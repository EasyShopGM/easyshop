angular.module('starter.controllers', [])
    .controller('AppCtrl', function($sessionStorage, $state, $rootScope, $scope, $ionicModal, $timeout, $http) {
        // Form data for the login modal
        $scope.logout = function() {
            $sessionStorage.$reset();
            //$rootScope.customdataloged = '';
            //$rootScope.tokenloged = '';
            //$rootScope.userloged = '';
            $state.go("login");
        }



    })

.controller('first', function($scope, $http, $timeout) {

    $timeout(function() {
        window.location = "#/app/newsoffers";
    }, 3000);

})

.controller('newsoffers', function($rootScope, $scope, $http, $location, $ionicPopup, $sessionStorage, $state, $ionicLoading, SrvCall) {


    //Inicializa la variable para que no rompa si viene vacio
    $scope.warehouse = [{}];

    //Llama al servicio con los parametros para que traiga las almacenes que tiene asiganado el usuario
    SrvCall.async('dummys/warehouse.json', 'GET', '')
        .success(function(resp) {
            $ionicLoading.hide();
            $scope.warehouses = resp;
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


    //Inicializa la variable para que no rompa si viene vacio
    //$scope.products=[{}];

    //Llama al servicio con los parametros para que traiga las almacenes que tiene asiganado el usuario
    SrvCall.async('dummys/products.json', 'GET', '')
        .success(function(resp) {
            $ionicLoading.hide();
            $scope.products = resp;
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


    $scope.addlist = function(product_) {
        $scope.data = {}

        if ($sessionStorage.userloged) {

            var url_ = product_.link;
            var myPopup = $ionicPopup.show({
                template: '<img src = ' + product_.link + ' style="width:50%; height:50%; margin:0% auto; display:block ">' +
                    '<p>Almacen</p>' +
                    '<div  class="row">' +
                     '<input type = "text" ng-model = "data.almacen" disabled></input>' +
                    '<button style="color: #58ACFA" class="button-icon icon ion-arrow-down-b" ng-visible="false" ng-click="assignwarehome({{product}})"></button>' +
                    '</div>' +
                    '<p>Cantidad:<p/>' +
                    '<div  class="row">' +
                    '<input type="number" placeholder="ingrese Cantidad" ng-model = "data.cantidad"></input>' +
                    '</div>',
                title: product_.title,
                subTitle: product_.price,
                scope: $scope,
                buttons: [{
                    text: 'Cancelar'
                }, {
                    text: '<b>Confirmar</b>',
                    type: 'button-calm',
                    onTap: function(e) {
                        if ((!$scope.data.cantidad) || (!$scope.data.almacen)) {
                            e.preventDefault();
                        }
                        else {
                            var popupNew = {
                                            "username": $sessionStorage.userloged.username,
                                            "almacen": $scope.data.almacen,
                                            "cantidad": $scope.data.cantidad
                                            }; 

                            /*
                            //Llama al servicio con los parametros para que insertar en ordenes de compra el producto
                            SrvCall.async('dummys/order.json', 'POST', '')
                                .success(function(resp) {
                                    $ionicLoading.hide();
                                    $scope.products = resp;
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
                            */
                            console.log(popupNew);
                            //return popupNew;
                        }
                    }
                }]
            });
            myPopup.then(function(product_) {
            });
        }
        else {
            var alertPopup = $ionicPopup.alert({
                title: 'EasyShop',
                template: '<img src = /img/alert.gif  style="width:10%; height:10%; margin-left:5%">  Debe estar autenticado.'
            });
            alertPopup.then(function(res) {
            });
            $state.go("login");
        }
    };

    $scope.assignwarehome = function(product_) {
        $scope.cont = {}
        $scope.warehousedata = {}

        //Llama al servicio con los parametros para que traiga las almacenes que tiene asiganado el usuario
        SrvCall.async('dummys/warehouse.json', 'GET', '')
            .success(function(resp) {
                $ionicLoading.hide();
                $scope.warehousedata = resp;
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
        

        var myPopup = $ionicPopup.show({
            template: 
                '<ion-list ng-repeat = "warehouseitem in warehousedata">' +
                '        <ion-checkbox type="checkbox" ng-model="warehouse.selected" ng-true-value="{{warehouseitem.description}}" ng-false-value="">{{warehouseitem.description}}</ion-checkbox>' +
                '</ion-list>',
            title: 'Mis almacenes',
            subTitle: '',
            scope: $scope,
            style: "color: #58ACFA",
            buttons: [{
                text: 'Cancelar'
            }, {
                text: '<b>Confirmar</b>',
                type: 'button-positive',    
                onTap: function(e) {
                    $scope.data.almacen = $scope.warehouse.selected;
                }
            }]
        });
        myPopup.then(function(product_) {
            
        });

    };
    


})

.controller('shoppinglist', function($scope, $http, $location, $sessionStorage, $state, $stateParams) {

    $scope.warehousetitle = $stateParams.warehouse;

    console.log($scope.warehousetitle);

    var x;
    var imptotal = 0.0;
    var impparcial = 0.0;

    $scope.warehouse_ = {
        "warehouse": {
            "name": "casa",
            "product": [{
                id: 0,
                name: "tomate en lata",
                unit: "",
                quantity: 4,
                price: 10.50,
                total: 10.50,
                estado: "comprado"
            }, {
                id: 1,
                name: "Cuadril",
                unit: "Kg",
                quantity: "1.4Kg",
                price: 10.50,
                total: 10.50,
                estado: "comprado"
            }, {
                id: 2,
                name: "Cerveza",
                unit: "",
                quantity: 4,
                price: 10.50,
                total: 42.00,
                estado: "pendiente"
            }, {
                id: 3,
                name: "Papa blanca",
                unit: "Kg",
                quantity: 1,
                price: 10.50,
                total: 10.50,
                estado: "pendiente"
            }, {
                id: 4,
                name: "Naranja",
                unit: "Kg",
                quantity: 2,
                price: 10.50,
                total: 21.00,
                estado: "pendiente"
            }, {
                id: 5,
                name: "Lavandina",
                unit: "",
                quantity: 1,
                price: 10.50,
                total: 10.50,
                estado: "pendiente"
            }]
        }
    };

    console.log("joda");
    console.log($scope.warehouse_);
    console.log($scope.warehouse_.warehouse);
    console.log($scope.warehouse_.warehouse.name);
    console.log($scope.warehouse_.warehouse.product);
    $scope.items = $scope.warehouse_.warehouse.product;


    for (x in $scope.items) {
        imptotal = imptotal + ($scope.items[x].price * $scope.items[x].quantity);
        if ($scope.items[x].estado == "comprado") {
            impparcial += $scope.items[x].price * $scope.items[x].quantity;
        }
    }

    $scope.imptotal = imptotal;
    $scope.impparcial = impparcial;

    console.log($scope.imptotal);

    $scope.adquirido = function(item, fromIndex, toIndex) {
        console.log("Adquirido");
        console.log(item);

    };

    $scope.editar = function(id_) {
        console.log("Editar");
        console.log(id_);
    };

    $scope.descartado = function(id_) {
        console.log("Descartado");
        console.log(id_);
    };

    $scope.doRefresh = function() {
        console.log("Refrescar");
        $scope.$broadcast('scroll.refreshComplete');
    };

    /*
    $scope.moveItem = function(item, fromIndex, toIndex) {
        console.log("acac");
        $scope.items.splice(fromIndex, 7);
        $scope.items.splice(toIndex, 0, item);
    };
    */

})

.controller('warehouseslist', function($scope, $http, $location, $sessionStorage, $state, SrvCall, $ionicLoading, $ionicPopup) {

    //Inicializa la variable para que no rompa si viene vacio
    $scope.warehouse = [{}];

    //Llama al servicio con los parametros para que traiga las almacenes que tiene asiganado el usuario
    SrvCall.async('dummys/warehouse.json', 'GET', '')
        .success(function(resp) {
            $ionicLoading.hide();
            $scope.warehouses = resp;
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

    $scope.clicker = function(warwhouse) {
        $scope.warehouse = warwhouse;
        $state.go("app.shoppinglist", {
            'warehouse': $scope.warehouse.description
        });
    };

    $scope.share = function(id_) {
        console.log("compartido" + id_);
    };

    $scope.edit = function(id_) {
        console.log("editar" + id_);
    };

    $scope.discard = function(id_) {
        console.log("descartado" + id_);
    };

    $scope.newwarehouse = function() {
        console.log("agraga alamcen");
    };

    $scope.doRefresh = function() {
        console.log("descartado");
    };


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
        $rootScope.customdataloged = $sessionStorage.customdataloged;
        $rootScope.userloged = $sessionStorage.userloged;
    }
    else {
        $rootScope.customdataloged = {
            foto: '/img/ios7-contact-outline.png'
        };
        $sessionStorage.customdataloged = $rootScope.customdataloged;
    }


    $scope.cancelar = function() {
        $state.go("app.newsoffers");
    }
})

.controller('login', function($state, $ionicLoading, $rootScope, $scope, $http, $location, SrvCallOauth, $sessionStorage, $ionicPopup, Base64) {

    if ($sessionStorage.userloged) {
        $state.go("app.newsoffers");
    }


    $scope.login = function() {
        //inicia el evento cargando y bloquea la pantalla

        $ionicLoading.show({
            template: '<ion-spinner icon="android"></ion-spinner>'
        });
        //if ($scope.username != '') {
        //    console.log('acac' + $scope.username.length);
        //}

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
                $state.go("app.newsoffers");

            })

        .error(function(resp) {
            //Apaga el evento cargando
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Autentication',
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
        $state.go("app.newsoffers");
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
                $state.go("app.newsoffers");

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




.controller('orderproduct', function($rootScope, $scope, $http, $location, $ionicPopup, $sessionStorage, $state, $ionicLoading, SrvCall) {


    //Inicializa la variable para que no rompa si viene vacio
    $scope.warehouse = [{}];

    //Llama al servicio con los parametros para que traiga las almacenes que tiene asiganado el usuario
    SrvCall.async('dummys/warehouse.json', 'GET', '')
        .success(function(resp) {
            $ionicLoading.hide();
            $scope.warehouses = resp;
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


    
    

    

    $scope.findproduct = function(marca_, product_) {
        //Inicializa la variable para que no rompa si viene vacio
        $scope.products=[{}];

        //Llama al servicio con los parametros para que traiga las almacenes que tiene asiganado el usuario
        SrvCall.async('https://3619otk88c.execute-api.us-east-1.amazonaws.com/prod/productos?string=' + marca_  + '&array_sucursales=10-1-5,10-3-678,11-3-1090,12-1-125,10-3-658,10-3-595,10-3-726,23-1-6225,10-3-553,10-3-626,12-1-83,10-3-727,12-1-35,10-3-326,10-3-688,10-3-733,10-3-398,12-1-90,10-3-722,10-3-643,23-1-6276,23-1-6219,23-1-6287,10-3-314,10-2-515,11-3-1047,23-1-6228,10-3-649,10-3-673,10-3-625&offset=0&limit=50&sort=-cant_sucursales_disponible', 'GET', '')
            .success(function(resp) {
                $ionicLoading.hide();
                $scope.products = resp.productos;
                console.log(resp.productos);
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
    };
        
    $scope.addlist = function(product_) {
        $scope.data = {}

        if ($sessionStorage.userloged) {

            var url_ = product_.link;
            console.log(product_);
            var imagenotfound = "'https://easyshop-gustavoarenas.c9users.io/img/imagenotfound.gif'";
            var myPopup = $ionicPopup.show({
                template: '<img src = https://imagenes.preciosclaros.gob.ar/productos/' + product_.id + '.jpg style="width:50%; height:50%; margin:0% auto; display:block"      onerror="this.onerror=null;this.src=' + imagenotfound + ';"  >' +
                    '<p>Almacen</p>' +
                    '<div  class="row">' +
                     '<input type = "text" ng-model = "data.almacen" disabled></input>' +
                    '<button style="color: #58ACFA" class="button-icon icon ion-arrow-down-b" ng-visible="false" ng-click="assignwarehome({{product}})"></button>' +
                    '</div>' +
                    '<p>Cantidad:<p/>' +
                    '<div  class="row">' +
                    '<input type="number" placeholder="ingrese Cantidad" ng-model = "data.cantidad"></input>' +
                    '</div>',
                title: product_.nombre,
                subTitle: "",
                scope: $scope,
                buttons: [{
                    text: 'Cancelar'
                }, {
                    text: '<b>Confirmar</b>',
                    type: 'button-calm',
                    onTap: function(e) {
                        if ((!$scope.data.cantidad) || (!$scope.data.almacen)) {
                            e.preventDefault();
                        }
                        else {
                            var popupNew = {
                                            "username": $sessionStorage.userloged.username,
                                            "almacen": $scope.data.almacen,
                                            "cantidad": $scope.data.cantidad
                                            }; 

                            /*
                            //Llama al servicio con los parametros para que insertar en ordenes de compra el producto
                            SrvCall.async('dummys/order.json', 'POST', '')
                                .success(function(resp) {
                                    $ionicLoading.hide();
                                    $scope.products = resp;
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
                            */
                            console.log(popupNew);
                            //return popupNew;
                        }
                    }
                }]
            });
            myPopup.then(function(product_) {
            });
        }
        else {
            var alertPopup = $ionicPopup.alert({
                title: 'EasyShop',
                template: '<img src = /img/alert.gif  style="width:10%; height:10%; margin-left:5%">  Debe estar autenticado.'
            });
            alertPopup.then(function(res) {
            });
            $state.go("login");
        }
    };

    $scope.assignwarehome = function(product_) {
        $scope.cont = {}
        $scope.warehousedata = {}

        //Llama al servicio con los parametros para que traiga las almacenes que tiene asiganado el usuario
        SrvCall.async('dummys/warehouse.json', 'GET', '')
            .success(function(resp) {
                $ionicLoading.hide();
                $scope.warehousedata = resp;
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
        

        var myPopup = $ionicPopup.show({
            template: 
                '<ion-list ng-repeat = "warehouseitem in warehousedata">' +
                '        <ion-checkbox type="checkbox" ng-model="warehouse.selected" ng-true-value="{{warehouseitem.description}}" ng-false-value="">{{warehouseitem.description}}</ion-checkbox>' +
                '</ion-list>',
            title: 'Mis almacenes',
            subTitle: '',
            scope: $scope,
            style: "color: #58ACFA",
            buttons: [{
                text: 'Cancelar'
            }, {
                text: '<b>Confirmar</b>',
                type: 'button-positive',    
                onTap: function(e) {
                    $scope.data.almacen = $scope.warehouse.selected;
                }
            }]
        });
        myPopup.then(function(product_) {
            
        });

    };
    


})