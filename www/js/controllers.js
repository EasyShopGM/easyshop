angular.module('starter.controllers', ['ionic', 'ngMessages'])
    .controller('AppCtrl', function($localStorage, $state, $rootScope, $scope, $ionicModal, $timeout, $http) {
        // Form data for the login modal
        $scope.logout = function() {
            $localStorage.$reset();

        }
    })

.controller('first', function($scope, $http, $timeout) {

    $timeout(function() {
        window.location = "#/app/newsoffers";
    }, 3000);
})


.controller('newsoffers', function($rootScope, $scope, $http, $location, $ionicPopup, $localStorage, $state, $ionicLoading, SrvCall) {


    //Inicializa la variable para que no rompa si viene vacio
    $scope.warehouse = [{}];
    $rootScope.page = "app.newsoffers";

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

        if ($localStorage.userloged) {

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
                                "username": $localStorage.userloged.username,
                                "almacen": $scope.data.almacen,
                                "cantidad": $scope.data.cantidad
                            };
                        }
                    }
                }]
            });
            myPopup.then(function(product_) {});
        }
        else {
            var alertPopup = $ionicPopup.alert({
                title: 'EasyShop',
                template: '<img src = /img/alert.gif  style="width:10%; height:10%; margin-left:5%">  Debe estar autenticado.'
            });
            alertPopup.then(function(res) {});
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
            template: '<ion-list ng-repeat = "warehouseitem in warehousedata">' +
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

/* ********* LISTA de COMPRAS ********* */
.controller('shoppinglist', function($rootScope, $scope, $http, $location, $localStorage, $state, $stateParams, SrvCall, $ionicLoading, $ionicPopup) {

    $scope.warehousetitle = $rootScope.warehouse.description;

    var x;
    var imptotal = 0.0;
    var impparcial = 0.0;

    SrvCall.async(MLAB_SRV + MONGODB_DB + PRODUCTS_URL + '?' + API_KEY + '&q={"idwarehouse":"' + $rootScope.warehouse._id.$oid + '"}&s={"Estado": 1}', 'GET', '')
        .success(function(resp) {
            $ionicLoading.hide();
            $scope.products = resp;

            for (x in $scope.products) {
                imptotal = imptotal + ($scope.products[x].precioMax * $scope.products[x].quantity);
                if ($scope.products[x].estado == COMPRADO) {
                    impparcial += $scope.products[x].precioMax * $scope.products[x].quantity;
                }
            }
            $scope.adquirido = function(item, fromIndex, toIndex) {};
        })
        .error(function(resp) {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Ups!',
                template: resp,
                okText: 'OK!'
            });
        });


    $scope.actionProduct = function(product_) {

        var estadoProduct = '';

        if (product_.Estado == PENDIENTE) {
            estadoProduct = '{ "$set" : { "Estado" : "' + COMPRADO + '" } }';
        }
        else if (product_.Estado == COMPRADO) {
            estadoProduct = '{ "$set" : { "Estado" : "' + DESCARTADO + '"} }';
        }
        else if (product_.Estado == DESCARTADO) {
            estadoProduct = '{ "$set" : { "Estado" : "' + PENDIENTE + '" } }';
        }
        else {
            estadoProduct = '{ "$set" : { "Estado" : "' +
                PENDIENTE + '" } }';
        };

        //SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/products_wh/' + product_._id.$oid + '?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3', 'PUT', estadoProduct)
        SrvCall.async(MLAB_SRV + MONGODB_DB + PRODUCTS_URL + '/' + product_._id.$oid + '?' + API_KEY, 'PUT', estadoProduct)
            .success(function(resp) {
                $ionicLoading.hide();
                //$scope.warehouses = resp;
                $scope.doRefresh();

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

    $scope.editar = function(id_) {
        console.log("Editar");
        console.log(id_);
    };

    $scope.descartado = function(id_) {
        console.log("Descartado");
        console.log(id_);
    };

    $scope.anotarproducto = function() {
        $state.go("app.orderproduct");
    };



    $scope.doRefresh = function() {
        $scope.$broadcast('scroll.refreshComplete');

        var x;
        var imptotal = 0.0;
        var impparcial = 0.0;

        SrvCall.async(MLAB_SRV + MONGODB_DB + PRODUCTS_URL + '?' + API_KEY + '&q={"idwarehouse":"' + $rootScope.warehouse._id.$oid + '"}&s={"Estado": 1}', 'GET', '')
            .success(function(resp) {
                $ionicLoading.hide();
                $scope.products = resp;
                for (x in $scope.products) {
                    imptotal = imptotal + ($scope.products[x].precioMax * $scope.products[x].quantity);
                    if ($scope.products[x].estado == COMPRADO) {
                        impparcial += $scope.products[x].precioMax * $scope.products[x].quantity;
                    }
                }
                $scope.adquirido = function(item, fromIndex, toIndex) {};
            })
            .error(function(resp) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Ups!',
                    template: resp,
                    okText: 'OK!'
                });
            });
    };

})

.controller('warehouseslist', function($rootScope, $scope, $http, $location, $localStorage, $state, SrvCall, $ionicLoading, $ionicPopup, $ionicModal) {


    if ($localStorage.userloged) {

        $scope.warehouse = [{}];
        //SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/warehouses?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3&q={"state": "valid", "users":{"user":"' + $localStorage.userloged.email + '"}}', 'GET', '')

        var criterio = 'q={$or: [{"state":"valid","users":{"user": "' + $localStorage.userloged.email + '","shared": true, "creator":  false}},{"state":"valid","users":{"user": "' + $localStorage.userloged.email + '","shared": true, "creator": true, "username": "' + $localStorage.userloged.username + '"}}]}';

        SrvCall.async(MLAB_SRV + MONGODB_DB + WHEREHOUSES_URL + '?' + API_KEY + '&' + criterio, 'GET', '')
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
    }
    else {
        var alertPopup = $ionicPopup.alert({
            title: 'EasyShop',
            template: '<img src = /img/alert.gif  style="width:10%; height:10%; margin-left:5%">  Debe estar autenticado.'
        });
        alertPopup.then(function(res) {});
        $rootScope.page = "app.warehouseslist";
        $state.go("app.warehouseslist");
        $state.go("login");
    }



    $scope.clicker = function(warwhouse) {
        $rootScope.warehouse = warwhouse;
        $state.go("app.shoppinglist", {
            'warehouse': $scope.warehouse.description
        });

    };

    /* lista de amigos*/
    $scope.share = function(warehouse_) {
        $rootScope.warehouse_ = warehouse_
        $state.go("app.findshare", {
            'warehouse_': $scope.warehouse_
        });

    };

    $scope.edit = function(id_) {
        console.log("editar" + id_);
    };

    $scope.discard = function(warwhouse) {

        $ionicLoading.hide();
        $ionicPopup.alert({
            title: 'Almacen',
            template: 'Confirma el borrado de la almacen?',
            buttons: [{
                text: 'Cancelar'
            }, {
                text: '<b>Confirmar</b>',
                type: 'button-calm',
                onTap: function(e) {

                    var objeto_Warehouse = '{"$set":{';
                    objeto_Warehouse = objeto_Warehouse + '"date_discarded":"' + Date.now() + '",';
                    objeto_Warehouse = objeto_Warehouse + '"state":"no valid",';
                    objeto_Warehouse = objeto_Warehouse + '"users_discarder":"' + $localStorage.userloged.email + '"';
                    objeto_Warehouse = objeto_Warehouse + '}}';

                    SrvCall.async(MLAB_SRV + MONGODB_DB + WHEREHOUSES_URL + '?' + API_KEY + '&q={"_id":{"$oid":"' + warwhouse._id.$oid + '"}}',
                            'PUT',
                            objeto_Warehouse
                        )
                        .success(function(resp) {
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: 'Almacen',
                                template: MSG_WAREHOUSE_DISCARD,
                                okText: 'OK!'
                            });
                            $scope.doRefresh();
                        })
                        .error(function(resp) {
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: 'Ups!',
                                template: resp,
                                okText: 'OK!'
                            });
                        });
                }
            }]
        });


    };

    $scope.newwarehouse = function() {

    console.log('la busqueda');
    console.log(MLAB_SRV + MONGODB_DB + PROFILEUSERS_URL + '?' + API_KEY + '&q={"email":"' + $localStorage.userloged.email + '"}&f={"group":1}');
        SrvCall.async(MLAB_SRV + MONGODB_DB + PROFILEUSERS_URL + '?' + API_KEY + '&q={"email":"' + $localStorage.userloged.email + '"}&f={"group":1}', 'GET', '')
            .success(function(resp) {
                $scope.listacompartida = resp[0].group;
                $ionicLoading.hide();
                console.log(resp[0]);
                
            })
            .error(function(resp) {
                $ionicLoading.hide();
            });




        $scope.warehouse = {}
        if ($localStorage.userloged) {

            var myPopup = $ionicPopup.show({
                template: '<p style="font-size: 90%; border-top: 1px solid rgb(204, 204, 204);" >Nombre de la neuva almacen</p>' +
                    '<div  class="row">' +
                    '<input type = "text" style="font-size: 90%;" ng-model = "warehouse.nombre"></input>' +
                    '</div>' +
                    '<p style="font-size: 90%;">Creador de la almacen<p/>' +
                    '<div  class="row">' +
                    '<input type="text" placeholder="' + $localStorage.userloged.email + '" style="font-size: 90%;" disabled></input>' +
                    '</div>',
                title: 'Almacen',
                subTitle: '',
                scope: $scope,
                buttons: [{
                    text: 'Cancelar'
                }, {
                    text: '<b>Confirmar</b>',
                    type: 'button-calm',
                    onTap: function(e) {
                        if ((!$scope.warehouse.nombre) || (!$localStorage.userloged.email)) {
                            e.preventDefault();
                        }
                        else {
                            var popupNew = {
                                "almacen": $scope.warehouse.nombre,
                                "cantidad": $scope.warehouse.emails
                            };

                            $ionicLoading.show({
                                template: 'Agregando a la lista...'
                            });


                            var newWarehouese ={"description": $scope.warehouse.nombre ,
//                                                "users": [{"user":"' + $localStorage.userloged.email + '"}],';
                                                "users": $scope.listacompartida,
                                                "users_discarder": "",
                                                "date_create": Date.now(),
                                                "date_purchase": "",
                                                "date_discarded": "",
                                                "state": "valid",
                                                "shared": "ion-ios-person-outline"};

                            

                            SrvCall.async(MLAB_SRV + MONGODB_DB + WHEREHOUSES_URL + '?' + API_KEY, 'POST', newWarehouese)
                                .success(function(resp) {
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        title: MSG_NEWWHEREHAUSE_SUCCESS,
                                        template: "",
                                        okText: 'OK!'
                                    });
                                    $scope.doRefresh();
                                })
                                .error(function(resp) {
                                    //Apaga el evento cargando
                                    $ionicLoading.hide();
                                    $ionicPopup.show({
                                        title: 'El producto no fue agregado.',
                                        subTitle: 'Verifique la conexión e intente nuevamente.',
                                        template: "",

                                    });
                                });

                            $scope.doRefresh();

                        }
                        $scope.doRefresh();
                    }
                }]
            });
        }
        else {
            var alertPopup = $ionicPopup.alert({
                title: 'EasyShop',
                template: '<img src = /img/alert.gif  style="width:10%; height:10%; margin-left:5%">  Debe estar autenticado.'
            });
            alertPopup.then(function(res) {});
            $rootScope.page = "app.orderproduct";
            $state.go("login");
        }
    };


    $scope.doRefresh = function() {
        $scope.$broadcast('scroll.refreshComplete');

//        var criterio = 'q={$or: [{"state":"valid","users":{"user": "' + $localStorage.userloged.email + '","shared": true, "creator":  false}},{"state":"valid","users":{"user": "' + $localStorage.userloged.email + '","shared": true, "creator":  true}}]}'
        var criterio = 'q={$or: [{"state":"valid","users":{"user": "' + $localStorage.userloged.email + '","shared": true, "creator":  false, "username": "' + $localStorage.userloged.username + '"}},{"state":"valid","users":{"user": "' + $localStorage.userloged.email + '","shared": true, "creator": true, "username": "' + $localStorage.userloged.username + '"}}]}}';
            //SrvCall.async(MLAB_SRV + MONGODB_DB + WHEREHOUSES_URL + '?' + API_KEY + '&q={"state": "valid", "users":{"user":"' + $localStorage.userloged.email + '", "shared":true}}', 'GET', '')
        SrvCall.async(MLAB_SRV + MONGODB_DB + WHEREHOUSES_URL + '?' + API_KEY + '&' + criterio, 'GET', '')
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

.controller('userprofile', function($state, $rootScope, $scope, $http, $location, $localStorage) {

    if ($localStorage.customdataloged) {
        $rootScope.customdataloged = $localStorage.customdataloged;
    }
    else {
        $rootScope.customdataloged = {
            foto: '/img/ios7-contact-outline.png'
        };
        $localStorage.customdataloged = $rootScope.customdataloged;
    }


    $scope.cancelar = function() {
        $state.go("app.newsoffers");
    }

    $scope.agrupar = function() {
        $state.go("app.group");
    }


})

.controller('login', function($state, $rootScope, $scope, $http, $location, SrvCallOauth, $localStorage, $ionicPopup, $ionicLoading, Base64) {


    if ($localStorage.userloged) {
        //$state.go("app.newsoffers");
        $state.go($rootScope.page);

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
                $ionicLoading.hide();
                $scope.userlogin(resp);
                //$state.go("app.newsoffers");
            })

        .error(function(resp) {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Autentication',
                template: '<p>' + msgLoginErr1 + '</p>' +
                    '<p>' + msgLoginErr2 + '</p>',
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
                $localStorage.userloged = $rootScope.userloged;
                $localStorage.userloged = $rootScope.userloged;
                $localStorage.tokenloged = url_backend_oauth + AUTH_DATA + token;
                $scope.customlogin(url_backend_oauth + AUTH_DATA + token + AUTH_DATA_CUSTOMDATA);
                //window.history.back();
                $state.go($rootScope.page);
            })

        .error(function(resp) {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Ups!',
                template: resp,
                okText: 'OK!'
            });
        });

    }

    $scope.customlogin = function(customlogin_) {
        SrvCallOauth.async(customlogin_, 'GET', '')
            .success(function(resp) {
                $rootScope.customdataloged = resp;
                $localStorage.customdataloged = $rootScope.customdataloged;
            })
            .error(function(resp) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Ups!',
                    template: resp,
                    okText: 'OK!'
                });
            });
    }


    $scope.cancelar = function() {
        //$state.go('app.newsoffers');
        window.history.back();
    }

})


.controller('register', function($state, $ionicLoading, $rootScope, $scope, $http, $location, SrvCallOauth, SrvCall, $localStorage, $ionicPopup) {


    $scope.register = function() {
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
                    'foto': 'https://www.gravatar.com/avatar/90c89a212acf87b6abe02937b388e740?s=32&d=retro',
                    'profile': $scope.userRegister.shared
                }
            })
            .success(function(resp) {
                $ionicLoading.hide();
                $rootScope.userloged = resp;
                $ionicPopup.alert({
                    title: 'Registration',
                    template: 'Te registraste correctamente, Verifica tu email para confirmar el acceso.',
                    okText: 'OK'
                });

                //SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/profileusers?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3', 'POST', {
                SrvCall.async(MLAB_SRV + MONGODB_DB + PROFILEUSERS_URL + '?' + API_KEY, 'POST', {
                        "email": $scope.userRegister.eMail,
                        "username": $scope.userRegister.username,
                        "photo": "http:\\",
                        "active": "1",
                        "logined": 0,
                        "newswarehouse": "",
                        "newsprpducts": "",
                        "shared": "",
                        "shared": [{
                            "user": $scope.userRegister.eMail,
                            "shared": true,
                            "creator": true
                        }]
                    })
                    .success(function(resp) {
                        $ionicLoading.hide();
                        $rootScope.userloged = resp;
                        $ionicPopup.alert({
                            title: 'Registration',
                            template: 'Creamos tu perfile satifactorio.',
                            okText: 'OK'
                        });

                    }).
                error(function(resp) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Registration',
                        template: resp.message,
                        okText: 'OK'
                    });
                });
                window.history.back();

            }).error(function(resp) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Registration',
                    template: resp.message,
                    okText: 'OK'
                });
            });
    }
})



.controller('shipping', function($scope, $http, $location) {

})

/* ****** Ordenar Producto ***** */
.controller('orderproduct', function($rootScope, $scope, $http, $location, $ionicPopup, $localStorage, $state, $ionicLoading, SrvCall) {
    $scope.warehouse = [];

    $scope.findproduct = function(marca_, product_) {
        $ionicLoading.show({
            template: 'Cargando...'
        });

        $scope.products = [];

        //SrvCall.async(PRECIOS_CLAROS, 'GET', '')
        SrvCall.async('https://3619otk88c.execute-api.us-east-1.amazonaws.com/prod/productos?string=' + marca_ + '&array_sucursales=10-1-5,10-3-678,11-3-1090,12-1-125,10-3-658,10-3-595,10-3-726,23-1-6225,10-3-553,10-3-626,12-1-83,10-3-727,12-1-35,10-3-326,10-3-688,10-3-733,10-3-398,12-1-90,10-3-722,10-3-643,23-1-6276,23-1-6219,23-1-6287,10-3-314,10-2-515,11-3-1047,23-1-6228,10-3-649,10-3-673,10-3-625&offset=0&limit=50&sort=-cant_sucursales_disponible', 'GET', '')
            .success(function(resp) {
                $ionicLoading.hide();
                $scope.products = resp.productos;
                //Apaga el evento cargando
                if ($scope.products.length == 0) {
                    $ionicPopup.alert({
                        title: 'Producto no encontrado',
                        subTitle: 'con el criterio "' + marca_ + '"',
                        template: "",
                        okText: 'OK!'
                    });
                }

            })
            .error(function(resp) {
                //Apaga el evento cargando
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Sin respuesta.',
                    template: resp,
                    okText: 'OK!'
                });
            });
    };

    $scope.addlist = function(product_) {

        $scope.data = {}

        if ($localStorage.userloged) {
            var url_ = product_.link;
            var myPopup = $ionicPopup.show({
                template: '<img src = https://imagenes.preciosclaros.gob.ar/productos/' + product_.id + '.jpg style="width:50%; height:50%; margin:0% auto; display:block" onerror="this.onerror=null;this.src=' + IMAGENOTFOUND + ';"  >' +
                    '</br>' +
                    '<p style="font-size: 90%; border-top: 1px solid rgb(204, 204, 204);" >Almacen</p>' +
                    '<div  class="row">' +
                    '<input type = "text" style="font-size: 90%;" ng-model = "data.almacen" disabled></input>' +
                    '<button style="color: #58ACFA" class="button-icon icon ion-arrow-down-b" ng-visible="false" ng-click="assignwarehome({{product}})"></button>' +
                    '</div>' +
                    '<p style="font-size: 90%;">Cantidad<p/>' +
                    '<div  class="row">' +
                    '<input type="number" placeholder="ingrese Cantidad a comprar" style="font-size: 90%;" ng-model = "data.cantidad"></input>' +
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
                                "username": $localStorage.userloged.username,
                                "almacen": $scope.data.almacen,
                                "cantidad": $scope.data.cantidad
                            };
                            $ionicLoading.show({
                                template: 'Agregando a la lista...'
                            });

                            var newProduct_wh = '{"idwarehouse":"' + $scope.data.oid + '","marca":"' + product_.marca + '","id":"' + product_.id + '","precioMax":' + product_.precioMax + ',"precioMin":' + product_.precioMin + ',"nombre":"' + product_.nombre + '","presentacion":"' + product_.presentacion + '","cantSucursalesDisponible":' + product_.cantSucursalesDisponible + ',"quantity":' + $scope.data.cantidad + ',"Estado":"' + PENDIENTE + '"}';

                            //SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/products_wh?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3', 'POST', newProduct_wh)
                            SrvCall.async(MLAB_SRV + MONGODB_DB + PRODUCTS_URL + '?' + API_KEY, 'POST', newProduct_wh)
                                .success(function(resp) {
                                    $ionicLoading.hide();
                                    $scope.products = resp;
                                    $ionicPopup.alert({
                                        title: 'El producto fue agregado a la lista.',
                                        template: "",
                                        okText: 'OK!'
                                    });

                                    $rootScope.page = "app.orderproduct";
                                    $state.go("login");
                                })
                                .error(function(resp) {
                                    //Apaga el evento cargando
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        title: 'El producto no fue agregado.',
                                        subTitle: 'Verifique la conexión e intente nuevamente.',
                                        template: "",
                                        okText: 'OK!'
                                    });
                                });
                        }
                    }
                }]
            });
            myPopup.then(function(product_) {});
        }
        else {
            var alertPopup = $ionicPopup.alert({
                title: 'EasyShop',
                template: '<img src = /img/alert.gif  style="width:10%; height:10%; margin-left:5%">  Debe estar autenticado.'
            });
            alertPopup.then(function(res) {});
            $rootScope.page = "app.orderproduct";
            $state.go("login");
        }
    };

    $scope.assignwarehome = function() {
        $scope.cont = {};
        $scope.warehousedata = {};
        //var criterio = 'q={$or: [{"state":"valid","users":{"user": "' + $localStorage.userloged.email + '","shared": true, "creator":  false}},{"state":"valid","users":{"user": "' + $localStorage.userloged.email + '","shared": true, "creator":  true}}]}'
        var criterio = 'q={$or: [{"state":"valid","users":{"user": "' + $localStorage.userloged.email + '","shared": true, "creator":  false}},{"state":"valid","users":{"user": "' + $localStorage.userloged.email + '","shared": true, "creator": true, "username": "' + $localStorage.userloged.username + '"}}]}';
        /*q = {
                "state": "valid",
                "users": {
                    "user": "' + $localStorage.userloged.email + '"
                }
            }*/
            //SrvCall.async(MLAB_SRV + MONGODB_DB + WHEREHOUSES_URL + '?' + API_KEY + '&q={"users":{"user":"' + $localStorage.userloged.email + '"}, "state":"valid"}', 'GET', '')
        SrvCall.async(MLAB_SRV + MONGODB_DB + WHEREHOUSES_URL + '?' + API_KEY + '&' + criterio, 'GET', '')

        .success(function(resp) {
                $ionicLoading.hide();
                //se guarda el objeto almacen seleccionado
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
            template: '<ion-list ng-repeat = "warehouseitem in warehousedata">' +
                '        <ion-checkbox type="checkbox" ng-model="warehouse.value" ng-true-value="{{warehouseitem.description}} | {{warehouseitem._id.$oid}} |" ng-false-value="">{{warehouseitem.description}}</ion-checkbox>' +
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

                    var itemrecuperado = $scope.warehouse.value;
                    $scope.data.almacen = itemrecuperado.substring(0, itemrecuperado.indexOf(" | "));
                    $scope.data.oid = itemrecuperado.substring(itemrecuperado.indexOf(" | ") + 3, itemrecuperado.length - 2);
                }
            }]

        });
        //myPopup.then(function(product_) {

    };



})

.controller('collaboration', function($rootScope, $scope, $http, $location, $localStorage, $state, SrvCall, $ionicLoading, $ionicPopup) {

})

.controller('findshare', function($rootScope, $scope, $http, $location, $localStorage, $state, SrvCall, $ionicLoading, $ionicPopup) {

    $scope.warehouse_ = $rootScope.warehouse_;
    $scope.shared_users = $scope.warehouse_.users;

    SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/warehouses/' + $rootScope.warehouse_._id.$oid + '?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3', 'GET', '')
        .success(function(resp) {
            $ionicLoading.hide();
            $scope.shareds = resp.users;
        })
        .error(function(resp) {
            $ionicLoading.hide();
        });


    $scope.compartirLista = function(oid_) {
        $ionicLoading.show({
            template: 'Actualizand...'
        });
        $ionicLoading.hide();


        $scope.alComp = 0;
        var filtrado = $scope.shareds.filter($scope.comp);

        var arr = [];
        for (var item in $scope.shareds) {
            arr.push( {
                "user": $scope.shareds[item].user,
                "shared": $scope.shareds[item].shared,
                "creator": $scope.shareds[item].creator,
                "username": $scope.shareds[item].username
            });

            }

        var objeto_body = '{"$set":{';
        objeto_body = objeto_body + '"users": ';
        //objeto_body = objeto_body + JSON.stringify($scope.shareds);
        objeto_body = objeto_body + JSON.stringify(arr);
        objeto_body = objeto_body + ' ';
        if ($scope.alComp > 1) {
            objeto_body = objeto_body + ',"shared": "ion-ios-people-outline"';
        }
        else {
            objeto_body = objeto_body + ',"shared": "ion-ios-person-outline"';
        }
        objeto_body = objeto_body + '}}';

        SrvCall.async(MLAB_SRV + MONGODB_DB + WHEREHOUSES_URL + '?' + API_KEY + '&q={"_id":{"$oid":"' + $rootScope.warehouse_._id.$oid + '"}}', 'PUT', objeto_body)
            .success(function(resp) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Lista de amigos',
                    subTitle: 'Has actualizado tu lista.',
                    template: "",
                    okText: 'OK!'
                });
                window.history.back();
            })
            .error(function(resp) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Sin respuesta.',
                    template: resp,
                    okText: 'OK!'
                });
            });
    };


    $scope.comp = function(itemComparado) {
        if ('shared' in itemComparado && itemComparado.shared == true) {
            $scope.alComp++;
        }
    };
})





.controller('group', function($rootScope, $scope, $http, $location, $localStorage, $state, SrvCall, $ionicLoading, $ionicPopup) {

    $scope.myGroup_select = {
        "group": []
    };
    $scope.myGroup_no_select = {
        "group": []
    };
  

    $ionicLoading.show({
        template: 'Cargando usuarios...'
    });

    SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/profileusers?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3&f={"email":1, "username":1, "group":1}', 'GET', '')
        .success(function(resp) {
            $ionicLoading.hide();
            $scope.amigos = resp;

            $scope.amigos.find($scope.profile_group);
            $scope.integrantes.find($scope.integrante);

            for (var integrante_true in $scope.myGroup_select.group) {

            if ($scope.myGroup_select.group[integrante_true].user == $localStorage.userloged.email){
                var reg =   {
                                visible:true,
                                creator: $scope.myGroup_select.group[integrante_true].creator,
                                existe_en_grupo: $scope.myGroup_select.group[integrante_true].existe_en_grupo,
                                shared: $scope.myGroup_select.group[integrante_true].shared,
                                user: $scope.myGroup_select.group[integrante_true].user,
                                username: $scope.myGroup_select.group[integrante_true].username
                            };
            } else {               
                var reg =   {
                                visible:false,
                                creator: $scope.myGroup_select.group[integrante_true].creator,
                                existe_en_grupo: $scope.myGroup_select.group[integrante_true].existe_en_grupo,
                                shared: $scope.myGroup_select.group[integrante_true].shared,
                                user: $scope.myGroup_select.group[integrante_true].user,
                                username: $scope.myGroup_select.group[integrante_true].username
                            };
            }

                $scope.myGroup_no_select.group[integrante_true] = reg;
                console.log($scope.myGroup_select.group);
                console.log($scope.myGroup_no_select.group);
            }
  
            $scope.comunidad_amigos = $scope.myGroup_no_select.group;
            
            
            $ionicLoading.hide();
        })
        .error(function(resp) {
            $ionicLoading.hide();
        });


    $scope.addFriends = function() {

        var objeto_body = '{$set:{';
        objeto_body = objeto_body + '"group":';
        objeto_body = objeto_body + JSON.stringify($rootScope.objputo);
        objeto_body = objeto_body + '}}';
        console.log(objeto_body);

        SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/profileusers?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3&q={"_id":{"$oid":"58bdc597f36d2837b811296d"}}', 'PUT', objeto_body)
        .success(function(resp) {
            $ionicLoading.hide();
            $scope.amigos = resp;

            $ionicLoading.hide();
        })
        .error(function(resp) {
            $ionicLoading.hide();
        });

    };

    $scope.profile_group = function(element, index, array) {
        if (element.email == $localStorage.userloged.email) {
            $scope.integrantes = element.group;
            return 1;
        }

    };

    $scope.integrante = function(element, index, array) {
        $scope.amigo_existe = element.user;
        $scope.amigos.find($scope.comunidad);
    };

    $scope.comunidad = function(elementComunidad, index, array) {
        var aa = '';

        if (elementComunidad.email == $scope.amigo_existe) {
            aa = {"user": elementComunidad.email, "username": elementComunidad.username, "shared": true, "creator": false, "existe_en_grupo": true};
            $scope.myGroup_select.group[index] = aa;
        }
        else {
            aa = {"user": elementComunidad.email, "username": elementComunidad.username, "shared": true, "creator": false, "existe_en_grupo": false};
            $scope.myGroup_no_select.group[index] = aa;
        }

    };

 $scope.chan = function(amigo) {

    $rootScope.objputo = [];
    $scope.comunidad_amigos.filter($scope.comunidad_to_friends);
  };
  
  $scope.comunidad_to_friends = function(items) {
        if ('existe_en_grupo' in items && items.existe_en_grupo == true) {
            console.log("dentro del filter");
            
            if($localStorage.userloged.email == items.user){
                $scope.owner = true;
            } else {
                $scope.owner = false;
            }
  
            var cont = {"user": items.user, "shared": false, "creator": $scope.owner, "username": items.username};
            $rootScope.objputo.push(cont); 
            
        }
    }; 
  

})