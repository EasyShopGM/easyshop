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
            $rootScope.warehouses = resp;
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
                template: '<img src = img/alert.gif  style="width:10%; height:10%; margin-left:5%">  Debe estar autenticado.'
            });
            alertPopup.then(function(res) {});
            $state.go("login");
        }
    };

    $scope.assignwarehome = function(product_) {
        $scope.cont = {};
        $scope.warehousedata = {};

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
            $scope.detailFavorited = $rootScope.warehouse.location_favorit;
                console.log($rootScope.warehouse.location_favorit);
            for (x in $scope.products) {
                if ($scope.products[x].Estado != DESCARTADO) {
                    imptotal = imptotal + ($scope.products[x].precioLista * $scope.products[x].quantity);
                    if ($scope.products[x].Estado == COMPRADO) {
                        impparcial += $scope.products[x].precioLista * $scope.products[x].quantity;
                    }
                }
            }
            $scope.adquirido = function(item, fromIndex, toIndex) {};
            $scope.imptotal = imptotal.toFixed(2);
            $scope.impparcial = impparcial.toFixed(2);
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

        
        $ionicLoading.show({
            template: 'Modificando estado del producto.'
        });
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
        $state.go("app.orderproductWH");
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
                $scope.detailFavorited = $rootScope.warehouse.location_favorit;
                console.log($rootScope.warehouse.location_favorit);
                for (x in $scope.products) {
                    if ($scope.products[x].Estado != DESCARTADO) {
                        imptotal = imptotal + ($scope.products[x].precioMax * $scope.products[x].quantity);
                        if ($scope.products[x].Estado == COMPRADO) {
                            impparcial += $scope.products[x].precioMax * $scope.products[x].quantity;
                        }
                    }
                }
                $scope.adquirido = function(item, fromIndex, toIndex) {};
                $scope.imptotal = imptotal.toFixed(2);
                $scope.impparcial = impparcial.toFixed(2);
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
        var criterio = 'q={$or: [{"state":"valid","users":{"user": "' + $localStorage.userloged.email + '","shared": true, "creator":  false}},{"state":"valid","users":{"user": "' + $localStorage.userloged.email + '","shared": true, "creator": true, "username": "' + $localStorage.userloged.username + '"}}]}';

        SrvCall.async(MLAB_SRV + MONGODB_DB + WHEREHOUSES_URL + '?' + API_KEY + '&' + criterio, 'GET', '')
            .success(function(resp) {
                $ionicLoading.hide();
                $rootScope.warehouses = resp;

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
            template: '<img src = img/alert.gif  style="width:10%; height:10%; margin-left:5%">  Debe estar autenticado.'
        });
        alertPopup.then(function(res) {});
        $rootScope.page = "app.warehouseslist";
        $state.go("app.warehouseslist");
        $state.go("login");
    }


    $scope.clicker = function(warwhouse) {
        $rootScope.warehouse = warwhouse;
        //aca poner si no esta definido si no tiene sucursal no podes agregar productos.
        //actualizar precios con la nueva sucursal.
        if ($rootScope.warehouse.branch_favorit != '' ){
            $state.go("app.shoppinglist", {
                'warehouse': $rootScope.warehouse.description
            });
        }
    };

    /* lista de amigos*/
    $scope.share = function(warehouse_) {
        $rootScope.warehouse_ = warehouse_
        $state.go("app.findshare", {
            'warehouse_': $scope.warehouse_
        });

    };



    $scope.quitwarehouse = function(id_) {
        $rootScope.warehouse = null;
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

        console.log(MLAB_SRV + MONGODB_DB + PROFILEUSERS_URL + '?' + API_KEY + '&q={"email":"' + $localStorage.userloged.email + '"}&f={"group":1}');
        SrvCall.async(MLAB_SRV + MONGODB_DB + PROFILEUSERS_URL + '?' + API_KEY + '&q={"email":"' + $localStorage.userloged.email + '"}&f={"group":1}', 'GET', '')
            .success(function(resp) {
                $scope.listacompartida = resp[0].group;
                $ionicLoading.hide();
                console.log("lista compartida");
                console.log($scope.listacompartida);

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


                            var newWarehouese = {
                                "description": $scope.warehouse.nombre,
                                //                                                "users": [{"user":"' + $localStorage.userloged.email + '"}],';
                                "users": $scope.listacompartida,
                                "users_discarder": "",
                                "date_create": Date.now(),
                                "date_purchase": "",
                                "date_discarded": "",
                                "state": "valid",
                                "shared": "ion-ios-person-outline"
                            };



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
                template: '<img src = img/alert.gif  style="width:10%; height:10%; margin-left:5%">  Debe estar autenticado.'
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
                $rootScope.warehouses = resp;

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


    $scope.branchOffice = function(warehouse) {
        $rootScope.warehouse = warehouse;
        console.log(warehouse);
        $state.go("app.branchoffice");
    };

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

    };


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

    };

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
    };


    $scope.cancelar = function() {
        //$state.go('app.newsoffers');
        window.history.back();
    };
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
                        "group": [{
                            "user": $scope.userRegister.eMail,
                            "shared": true,
                            "creator": true,
                            "username": $scope.userRegister.username
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
.controller('orderproduct', function($rootScope, $scope, $http, $location, $ionicPopup, $localStorage, $state, $ionicLoading, SrvCall, SrvCallPreciosClaros) {



    $scope.findproduct = function(marca_, product_) {
        $ionicLoading.show({
            template: 'Cargando...'
        });

        $scope.products = [];

        //SrvCall.async(PRECIOS_CLAROS, 'GET', '')
        SrvCallPreciosClaros.async(HOST_PRECIOSCLAROS + '/prod/productos?string=' + marca_ + '&array_sucursales=10-1-5,10-3-678,11-3-1090,12-1-125,10-3-658,10-3-595,10-3-726,23-1-6225,10-3-553,10-3-626,12-1-83,10-3-727,12-1-35,10-3-326,10-3-688,10-3-733,10-3-398,12-1-90,10-3-722,10-3-643,23-1-6276,23-1-6219,23-1-6287,10-3-314,10-2-515,11-3-1047,23-1-6228,10-3-649,10-3-673,10-3-625&offset=0&limit=50&sort=-cant_sucursales_disponible', 'GET', '')
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

        $scope.data = {};

        if ($localStorage.userloged) {


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
                template: '<img src = img/alert.gif  style="width:10%; height:10%; margin-left:5%">  Debe estar autenticado.'
            });
            alertPopup.then(function(res) {});
            $rootScope.page = "app.orderproduct";
            $state.go("login");
        }
    };

    $scope.assignwarehome = function() {
        $scope.cont = {};
        $scope.warehousedata = [];
        var criterio = '';

        //$scope.warehousedata = $rootScope.warehouse;


        criterio = 'q={$or: [{"state":"valid","users":{"user": "' + $localStorage.userloged.email + '","shared": true, "creator":  false}},{"state":"valid","users":{"user": "' + $localStorage.userloged.email + '","shared": true, "creator": true, "username": "' + $localStorage.userloged.username + '"}}]}';
        //            criterio = 'q={$or: [{"state":"valid","users":{"user": "' + $localStorage.userloged.email + '","shared": true, "creator":  false}},{"state":"valid","users":{"user": "' + $localStorage.userloged.email + '","shared": true, "creator": true, "username": "' + $localStorage.userloged.username + '"}}],"description":"' + $rootScope.warehouse.description + '"}';

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
                '        <ion-checkbox type="checkbox" ng-change="change123(warehouseitem.description, warehouseitem._id.$oid)" ng-model="warehouse.value" ng-true-value="{{warehouseitem.description}} | {{warehouseitem._id.$oid}} |" ng-false-value="">{{warehouseitem.description}}</ion-checkbox>' +
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

                    /*var itemrecuperado = $scope.warehouse.value;
                    $scope.data.almacen = itemrecuperado.substring(0, itemrecuperado.indexOf(" | "));
                    $scope.data.oid = itemrecuperado.substring(itemrecuperado.indexOf(" | ") + 3, itemrecuperado.length - 2);*/
                    /*$scope.data.almacen = itemrecuperado.substring(0, itemrecuperado.indexOf(" | "));
                    $scope.data.oid = itemrecuperado.substring(itemrecuperado.indexOf(" | ") + 3, itemrecuperado.length - 2);*/
                }
            }]

        });
        //myPopup.then(function(product_) {


    };


    $scope.change123 = function(changeDescription, changeID) {

        $scope.data.almacen = changeDescription;
        $scope.data.oid = changeID;
    };


})

/* ****** Ordenar Producto WH***** */
.controller('orderproductWH', function($rootScope, $scope, $http, $location, $ionicPopup, $localStorage, $state, $ionicLoading, SrvCall, SrvCallPreciosClaros) {



    $scope.findproductWH = function(marca_, product_) {
        $ionicLoading.show({
            template: 'Cargando...'
        });

        $scope.products = [];

        //SrvCall.async(PRECIOS_CLAROS, 'GET', '')
        //SrvCallPreciosClaros.async(HOST_PRECIOSCLAROS + '/prod/productos?string=' + marca_ + '&array_sucursales=10-1-5,10-3-678,11-3-1090,12-1-125,10-3-658,10-3-595,10-3-726,23-1-6225,10-3-553,10-3-626,12-1-83,10-3-727,12-1-35,10-3-326,10-3-688,10-3-733,10-3-398,12-1-90,10-3-722,10-3-643,23-1-6276,23-1-6219,23-1-6287,10-3-314,10-2-515,11-3-1047,23-1-6228,10-3-649,10-3-673,10-3-625&offset=0&limit=50&sort=-cant_sucursales_disponible', 'GET', '')
        
        console.log($rootScope.warehouse.branch_favorit);
        
        SrvCallPreciosClaros.async(HOST_PRECIOSCLAROS + '/prod/productos?string=' + marca_ + '&array_sucursales=' + $rootScope.warehouse.branch_favorit + '&offset=0&limit=50&sort=-cant_sucursales_disponible', 'GET', '')
            .success(function(resp) {
                $ionicLoading.hide();
                $scope.products = resp.productos;
                console.log(resp);
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

    $scope.addlistWH = function(product_) {

        $scope.data = {};
        $scope.productsAnalitic = '';

        if ($localStorage.userloged) {

            console.log(product_);
            console.log(product_.id);
            console.log($rootScope.warehouse.branch_favorit);
           





            if (($rootScope.warehouse === undefined) || ($rootScope.warehouse == null)) {
             var myPopup = $ionicPopup.show({
                template: 'Seleccione una sucursal.',
                title: 'Productos',
                style: "color: #58ACFA",
                buttons: [{
                    text: 'Cancelar'
                }, {
                    text: '<b>Confirmar</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                    }
                }]

            });   
            } else {
                $scope.data.almacen = $rootScope.warehouse.description; //itemrecuperado.substring(0, itemrecuperado.indexOf(" | "));
                $scope.data.oid = $rootScope.warehouse._id.$oid; //itemrecuperado.substring(itemrecuperado.indexOf(" | ") + 3, itemrecuperado.length - 2);
                
                 //aca la segunda consulta



                SrvCallPreciosClaros.async(HOST_PRECIOSCLAROS + COMPARATIVA + '?array_sucursales=' + $rootScope.warehouse.branch_favorit + '&array_productos=' + product_.id, 'GET', '')
                    .success(function(resp) {
                        console.log("recuoero del producto con detalle de comparativa")
                        console.log(resp);
                        console.log(resp.sucursales[0].productos[0])
                        console.log(resp.sucursales[0].productos[0].promo1)
                        console.log(resp.sucursales[0].productos[0].promo2)
                        $scope.productsAnalitic =  resp;
                        

                    
                
                console.log("tomo el valor");
            console.log($scope.productsAnalitic);
            
            var cuerpoPromo = '';
            if ($scope.productsAnalitic.sucursales[0].productos[0].promo1.precio != '') {
                cuerpoPromo = cuerpoPromo + '<p style="font-size: 90%; border-top: 1px solid rgb(204, 204, 204);" >Promo: $' + $scope.productsAnalitic.sucursales[0].productos[0].promo1.precio + '</p>'
                cuerpoPromo = cuerpoPromo + '<p style="font-size: 90%;" >' + $scope.productsAnalitic.sucursales[0].productos[0].promo1.descripcion + '</p>'
            }
            if ($scope.productsAnalitic.sucursales[0].productos[0].promo2.precio != '') {
                cuerpoPromo = cuerpoPromo + '<p style="font-size: 90%; border-top: 1px solid rgb(204, 204, 204);" >Promo: $' + $scope.productsAnalitic.sucursales[0].productos[0].promo2.precio + '</p>'
                cuerpoPromo = cuerpoPromo + '<p style="color: red; font-size: 65%;" >' + $scope.productsAnalitic.sucursales[0].productos[0].promo2.descripcion + '</p>'
            }
            
            
            var myPopup = $ionicPopup.show({
                template: '<img src = https://imagenes.preciosclaros.gob.ar/productos/' + product_.id + '.jpg style="width:50%; height:50%; margin:0% auto; display:block" onerror="this.onerror=null;this.src=' + IMAGENOTFOUND + ';"  >' +
                    '</br>' + cuerpoPromo + 
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

                            //var newProduct_wh = '{"idwarehouse":"' + $scope.data.oid + '","marca":"' + product_.marca + '","id":"' + product_.id + '","precioMax":' + product_.precioMax + ',"precioMin":' + product_.precioMin + ',"nombre":"' + product_.nombre + '","presentacion":"' + product_.presentacion + '","cantSucursalesDisponible":' + product_.cantSucursalesDisponible + ',"quantity":' + $scope.data.cantidad + ',"Estado":"' + PENDIENTE + '"}';
                            
                            /*joya
                            var newProduct_wh = {"idwarehouse": $scope.data.oid, 
                                                 "marca": product_.marca, 
                                                 "id": product_.id, 
                                                 "precioMax": product_.precioMax, 
                                                 "precioMin": product_.precioMin, 
                                                 "nombre": product_.nombre, 
                                                 "presentacion": product_.presentacion, 
                                                 "cantSucursalesDisponible": product_.cantSucursalesDisponible, 
                                                 "quantity": $scope.data.cantidad, 
                                                 "Estado": PENDIENTE};
                            */                     
                            var newProduct_wh = {"idwarehouse": $scope.data.oid, 
                                                    "quantity": $scope.data.cantidad, 
                                                    "Estado": PENDIENTE,
                                                    "id":$scope.productsAnalitic.sucursales[0].productos[0].id,
                                                    "marca":$scope.productsAnalitic.sucursales[0].productos[0].marca,
                                                    "nombre":$scope.productsAnalitic.sucursales[0].productos[0].nombre,
                                                    "precioLista":$scope.productsAnalitic.sucursales[0].productos[0].precioLista,
                                                    "precio_unitario_con_iva":$scope.productsAnalitic.sucursales[0].productos[0].precio_unitario_con_iva,
                                                    "precio_unitario_sin_iva":$scope.productsAnalitic.sucursales[0].productos[0].precio_unitario_sin_iva,
                                                    "presentacion":$scope.productsAnalitic.sucursales[0].productos[0].presentacion,
                                                    "unidad_venta":$scope.productsAnalitic.sucursales[0].productos[0].unidad_venta,
                                                    "promo1":{
                                                                "descripcion":$scope.productsAnalitic.sucursales[0].productos[0].promo1.descripcion,
                                                                "precio":$scope.productsAnalitic.sucursales[0].productos[0].promo1.precio,
                                                                "precio_unitario_con_iva":$scope.productsAnalitic.sucursales[0].productos[0].promo1.precio_unitario_con_iva,
                                                                "precio_unitario_sin_iva":$scope.productsAnalitic.sucursales[0].productos[0].promo1.precio_unitario_sin_iva
                                                            },
                                                    "promo2":{
                                                                "descripcion":$scope.productsAnalitic.sucursales[0].productos[0].promo2.descripcion,
                                                                "precio":$scope.productsAnalitic.sucursales[0].productos[0].promo2.precio,
                                                                "precio_unitario_con_iva":$scope.productsAnalitic.sucursales[0].productos[0].promo2.precio_unitario_con_iva,
                                                                "precio_unitario_sin_iva":$scope.productsAnalitic.sucursales[0].productos[0].promo2.precio_unitario_sin_iva
                                                            }
                                                };
                            
                            
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

                                    $rootScope.page = "app.orderproductWH";
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
            
            
            
            
                    })
                    .error(function(resp) {

                    });
            
            
            //myPopup.then(function(product_) {});
            }
        }
        else {
            var alertPopup = $ionicPopup.alert({
                title: 'EasyShop',
                template: '<img src = img/alert.gif  style="width:10%; height:10%; margin-left:5%">  Debe estar autenticado.'
            });
            alertPopup.then(function(res) {});
            $rootScope.page = "app.orderproductWH";
            $state.go("login");
        }
    };

    $scope.assignwarehomeWH = function() {
        $scope.cont = {};
        $scope.warehousedata = [];
        var criterio = '';

        $scope.warehousedata = $rootScope.warehouse;

        if (($rootScope.warehouse === undefined) || ($rootScope.warehouse == null)) {
            criterio = 'q={$or: [{"state":"valid","users":{"user": "' + $localStorage.userloged.email + '","shared": true, "creator":  false}},{"state":"valid","users":{"user": "' + $localStorage.userloged.email + '","shared": true, "creator": true, "username": "' + $localStorage.userloged.username + '"}}]}';
            //            criterio = 'q={$or: [{"state":"valid","users":{"user": "' + $localStorage.userloged.email + '","shared": true, "creator":  false}},{"state":"valid","users":{"user": "' + $localStorage.userloged.email + '","shared": true, "creator": true, "username": "' + $localStorage.userloged.username + '"}}],"description":"' + $rootScope.warehouse.description + '"}';

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

        }
        else {
            $scope.data.almacen = $rootScope.warehouse.description; //itemrecuperado.substring(0, itemrecuperado.indexOf(" | "));
            $scope.data.oid = $rootScope.warehouse._id.$oid; //itemrecuperado.substring(itemrecuperado.indexOf(" | ") + 3, itemrecuperado.length - 2);
        }
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
            arr.push({
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

                if ($scope.myGroup_select.group[integrante_true].user == $localStorage.userloged.email) {
                    var reg = {
                        visible: true,
                        creator: $scope.myGroup_select.group[integrante_true].creator,
                        existe_en_grupo: $scope.myGroup_select.group[integrante_true].existe_en_grupo,
                        shared: $scope.myGroup_select.group[integrante_true].shared,
                        user: $scope.myGroup_select.group[integrante_true].user,
                        username: $scope.myGroup_select.group[integrante_true].username
                    };
                }
                else {
                    var reg = {
                        visible: false,
                        creator: $scope.myGroup_select.group[integrante_true].creator,
                        existe_en_grupo: $scope.myGroup_select.group[integrante_true].existe_en_grupo,
                        shared: $scope.myGroup_select.group[integrante_true].shared,
                        user: $scope.myGroup_select.group[integrante_true].user,
                        username: $scope.myGroup_select.group[integrante_true].username
                    };
                }

                $scope.myGroup_no_select.group[integrante_true] = reg;
                /*                console.log("no definido");
                                console.log($scope.myGroup_select);
                                console.log($scope.myGroup_no_select.group);*/
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

        SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/profileusers?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3&q={"email":"' + $localStorage.userloged.email + '"}', 'PUT', objeto_body)
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
            aa = {
                "user": elementComunidad.email,
                "username": elementComunidad.username,
                "shared": true,
                "creator": false,
                "existe_en_grupo": true
            };
            $scope.myGroup_select.group[index] = aa;
        }
        else {
            aa = {
                "user": elementComunidad.email,
                "username": elementComunidad.username,
                "shared": true,
                "creator": false,
                "existe_en_grupo": false
            };
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

            if ($localStorage.userloged.email == items.user) {
                console.log("paso por verdadero");
                $scope.owner = true;
                $scope.mylistShared = true;
            }
            else {
                console.log("paso por falso");
                $scope.owner = false;
                $scope.mylistShared = false;
            }

            var cont = {
                "user": items.user,
                "shared": $scope.mylistShared,
                "creator": $scope.owner,
                "username": items.username
            };
            console.log(cont);
            $rootScope.objputo.push(cont);

        }
    };


})

.controller('resetpass', function($state, $rootScope, $scope, $http, $location, SrvCallOauth, $localStorage, $ionicPopup, $ionicLoading, Base64) {


    $scope.sendReset = function() {

        alert("ingreso");
        //$scope.reset.eMail
        var data_reset = {
            "email": $scope.reset.eMail
        };

        alert(url_backend_oauth + RESETPASSWORD);
        alert(data_reset);

        SrvCallOauth.async(url_backend_oauth + RESETPASSWORD, 'POST', data_reset)
            .success(function(resp) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Reset Password',
                    template: '<p>The password was successfully reset. Enter your email to enter the new password.</p>',
                    okText: 'OK!'
                });
                $state.go("app.newsoffers");
            })

        .error(function(resp) {
            $ionicLoading.hide();
            alert(resp);
            $ionicPopup.alert({
                title: 'Reset Password',
                template: '<p>Reset password failed.</p>',
                okText: 'OK!'
            });
        });
    };


})

.controller('branchoffice', function($rootScope, $scope, $http, $location, $localStorage, $state, SrvCall, $ionicLoading, $ionicPopup, SrvCallPreciosClaros) {

    SrvCall.async(MLAB_SRV + MONGODB_DB + PRODUCTS_URL + '?' + API_KEY + '&q={"idwarehouse":"' + $rootScope.warehouse._id.$oid + '"}&s={"Estado": 1}', 'GET', '')
        .success(function(resp) {
            $ionicLoading.hide();
            console.log("Lista de productos seleccionados");
            //console.log(resp);

            var listProducts = resp;

            var arrayParamListProd = '';

            if (listProducts.length > 0) {

                listProducts.forEach(function(itemListProduct) {
                    arrayParamListProd = arrayParamListProd + itemListProduct.id + ',';
                });

                arrayParamListProd = arrayParamListProd + arrayParamListProd.substring(0, arrayParamListProd.length - 1);

            }
            //console.log(arrayParamListProd);

            $scope.currSels = $rootScope.warehouse.branch_office;
            //console.log($scope.currSels);

            var branchHeart = '';
            var item = '';
            var obj = '';
            $scope.currSelsNew = [];
            console.log("Lista de productos seleccionados 2");

            //var headerBranchOffice = ''; 
            console.log("que es branch office");
            console.log($scope.currSels);
            if (($scope.currSels === undefined) || ($scope.currSels == null)) {}
            else {
                $scope.currSels.forEach(function(itemBranchOffice) {
                    //console.log(HOST_PRECIOSCLAROS + '/prod/comparativa?array_sucursales=' + itemBranchOffice.id + '&array_productos=' + arrayParamListProd);
                    SrvCallPreciosClaros.async(HOST_PRECIOSCLAROS + '/prod/comparativa?array_sucursales=' + itemBranchOffice.id + '&array_productos=' + arrayParamListProd, 'GET', '')
                        .success(function(resp) {
                            $scope.compartiveBreanches = resp;
                            if (($scope.compartiveBreanches.totalProductos === undefined) || ($scope.compartiveBreanches.totalProductos == null)) {
                                item = {
                                    "quantityProductsFound": 0.00,
                                    "totalValueProductsFound": 0.00
                                };
                            }
                            else {
                                if ($scope.compartiveBreanches.sucursales[0].id == $rootScope.warehouse.branch_favorit) {
                                    branchHeart = 'ion-ios-heart';
                                } else {
                                    branchHeart = 'ion-ios-heart-outline';
                                }
                                //console.log($scope.compartiveBreanches.sucursales[0].branchHeart);
                                item = {
                                    "quantityProductsFound": $scope.compartiveBreanches.totalProductos,
                                    "totalValueProductsFound": $scope.compartiveBreanches.sucursales[0].sumaPrecioListaTotal,
                                    "branchHeart": branchHeart
                                };
                            }
                            obj = Object.assign({}, itemBranchOffice, item);
                            $scope.currSelsNew.push(obj);
                        })
                        .error(function(resp) {

                        });

                });
            }
        })
        .error(function(resp) {

        });
    
    $scope.addTypeBranchOffice = function() {
        $state.go("app.typeBranchOffice");
    };
    
    $scope.branchFavorit = function(ob) {
        
        $ionicLoading.show({
            template: 'Estableciendo comercio favorito.'
        });
        var objeto_Warehouse = '{ "$set" : { "branch_favorit" : "' + ob.id + '", "location_favorit" : "' + ob.banderaDescripcion + ' - ' + ob.sucursalNombre + '"} }';

        SrvCall.async(MLAB_SRV + MONGODB_DB + WHEREHOUSES_URL + '?' + API_KEY + '&q={"_id":{"$oid":"' + $rootScope.warehouse._id.$oid + '"}}',
                'PUT',
                objeto_Warehouse
            )
            .success(function(resp) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Asignación de comercio',
                    template: 'Se establecio el comercio correctamente.',
                    okText: 'OK!'
                });

                
/*
            SrvCall.async(MLAB_SRV + MONGODB_DB + PRODUCTS_URL + '?' + API_KEY + '&q={"_id":{"$oid":"' + $rootScope.warehouse._id.$oid + '"}}', 
                'PUT', 
                objeto_Warehouse)
            .success(function(resp) {
                $ionicLoading.hide();

            })
            .error(function(resp) {
                $ionicLoading.hide();

            });

*/

                //console.log($scope.compartiveBreanches.sucursales);
                //el objeto de sucursal favorita
                console.log(ob);
                console.log(ob.id);
                //ID de almacen a la que se setea
                console.log($rootScope.warehouse._id.$oid);
                console.log("Le pego al docuemnto products_wh.");
                //busco todos los precios
                console.log($scope.compartiveBreanches);
                
                
                
                
                $state.go("app.warehouseslist");
            })
            .error(function(resp) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Asignación de comercio',
                    template: 'No se pudo realiar la operación.',
                    okText: 'OK!'
                });
            });
       
        
    };
    
    $scope.removeItem = function(id_item) {

        $ionicLoading.show({
            template: 'Eliminando comercio de la lista.'
        });

        $rootScope.warehouse.branch_office.splice(id_item,1);
        var objeto_Warehouse = '{ "$set" : { "branch_office" : ' + JSON.stringify($rootScope.warehouse.branch_office) + ' } }';

        SrvCall.async(MLAB_SRV + MONGODB_DB + WHEREHOUSES_URL + '?' + API_KEY + '&q={"_id":{"$oid":"' + $rootScope.warehouse._id.$oid + '"}}',
                'PUT',
                objeto_Warehouse
            )
            .success(function(resp) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Asignación de comercio',
                    template: 'Se elimino correctamente.',
                    okText: 'OK!'
                });
                $state.go("app.warehouseslist");
            })
            .error(function(resp) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Asignación de comercio',
                    template: 'No se pudo realiar la operación.',
                    okText: 'OK!'
                });
            });
        
    };

})

.controller('typeBranchOffice', function($rootScope, $scope, $http, $location, $localStorage, $state, SrvCall, SrvCallPreciosClaros, $ionicLoading, $ionicPopup) {

    $rootScope.chainComerce = 'Todos';
    $rootScope.typeComerce = 'Todos';


    $scope.filterType = function() {

        $scope.selecction = "type";
        SrvCallPreciosClaros.async(HOST_PRECIOSCLAROS + '/dev/filtros?field=sucursal_tipo', 'GET', '')
            .success(function(resp) {
                $ionicLoading.hide();
                $scope.typeBranchOffices = resp.valoresFiltrables;
                $ionicLoading.hide();
            })
            .error(function(resp) {
                $ionicLoading.hide();
            });
    };

    $scope.filterChain = function() {
        $scope.selecction = "chain";


        SrvCallPreciosClaros.async(HOST_PRECIOSCLAROS + '/dev/filtros?field=comercio_bandera_nombre', 'GET', '')
            .success(function(resp) {
                $ionicLoading.hide();
                $scope.typeBranchOffices = resp.valoresFiltrables;
                $ionicLoading.hide();
            })
            .error(function(resp) {
                $ionicLoading.hide();
            });
    };

    $scope.branchOffices = function() {
        $state.go("app.branchOffices");
    };

    $scope.loadTypeBranchOffice = function(itemTypeBranchoffice) {
        if ($scope.selecction == "type") {
            $rootScope.typeComerce = itemTypeBranchoffice;
            $rootScope.chainComerce = 'Todos';
            $scope.$root.Searchproductos = '';
        }
        if ($scope.selecction == "chain") {
            $rootScope.chainComerce = itemTypeBranchoffice;
            $rootScope.typeComerce = 'Todos';
            $scope.$root.Searchproductos = '';
        }
    };

})

.controller('branchOffices', function($rootScope, $scope, $http, $location, $localStorage, $state, SrvCall, SrvCallPreciosClaros, $ionicLoading, $ionicPopup) {

    $scope.arrAddSucursal = [];
    $scope.noMoreItemsAvailable = false;
    $scope.nroPag = 0;

    var varCriterioType = '';
    var varCriterioBranchOffice = '';
    $scope.listBranchOffices = [];

    $scope.setBranchOffices = function(itemBranchOffice, id) {
        $ionicLoading.show({
            template: 'Asignando una sucursal a la lista...'
        });

        //console.log($scope.arrAddSucursal);
        console.log("hare the branch select");
        console.log($rootScope.warehouse.branch_office);
        var myobjCaajo = $rootScope.warehouse.branch_office;
        $rootScope.warehouse.branch_office = myobjCaajo.concat($scope.arrAddSucursal);
        myobjCaajo = '';
        
        
        console.log("mi puto array");
        console.log(myobjCaajo);
        
        var objeto_Warehouse = '{ "$set" : { "branch_office" : ' + JSON.stringify($rootScope.warehouse.branch_office) + ' } }';

        SrvCall.async(MLAB_SRV + MONGODB_DB + WHEREHOUSES_URL + '?' + API_KEY + '&q={"_id":{"$oid":"' + $rootScope.warehouse._id.$oid + '"}}',
                'PUT',
                objeto_Warehouse
            )
            .success(function(resp) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Asignación de comercio',
                    template: 'Se actualizo correctamente.',
                    okText: 'OK!'
                });
                $state.go("app.warehouseslist");
            })
            .error(function(resp) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Asignación de comercio',
                    template: 'No se pudo realiar la operación.',
                    okText: 'OK!'
                });
            });
    };

    $scope.doRefresh = function() {

        console.log("en el refresh");
        $scope.noMoreItemsAvailable = false;
        var varCriterioType = '';
        var varCriterioBranchOffice = '';

        $scope.noMoreItemsAvailable = false;
        $scope.nroPag = 0;

        $scope.listBranchOffices = [];
        $ionicLoading.hide();

        $scope.noMoreItemsAvailable = false;
        $scope.loadMore();
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $scope.loadMore = function() {
        $scope.nroPagContenido = $scope.nroPag * 30;
        $scope.nroPag = $scope.nroPag + 1;
        var varCriterioType = '';
        var varCriterioBranchOffice = '';

        if ($rootScope.typeComerce != 'Todos') {
            varCriterioType = '&sucursal_tipo=["' + $rootScope.typeComerce + '"]';
        }

        if ($rootScope.chainComerce != 'Todos') {
            varCriterioBranchOffice = '&comercio_bandera_nombre=["' + $rootScope.chainComerce + '"]';
        }

        SrvCallPreciosClaros.async(HOST_PRECIOSCLAROS + '/dev/sucursales?limit=30&offset=' + $scope.nroPagContenido + varCriterioType + varCriterioBranchOffice, 'GET', '')
            .success(function(resp) {

                $scope.listBranchOffices = $scope.listBranchOffices.concat(resp.sucursales);

                if (resp.totalPagina == 0) {
                    $scope.noMoreItemsAvailable = true;
                }
                else {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.noMoreItemsAvailable = false;
                }
            })
            .error(function(resp) {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.noMoreItemsAvailable = true;
            });

    };

    $scope.selectBranchOffice = function(itemBranchOffice, id) {
        if (document.getElementById("itemBranchOffice_" + itemBranchOffice.id).style.backgroundColor == "rgb(119, 194, 251)") {
            document.getElementById("itemBranchOffice_" + itemBranchOffice.id).style.backgroundColor = "White";
        }
        else {
            document.getElementById("itemBranchOffice_" + itemBranchOffice.id).style.backgroundColor = "rgb(119, 194, 251)";
            
/*            var itm = '';
                itm = itm + '"id" : ' + itemBranchOffice.id + ',';
                itm = itm + '"banderaId" : ' + itemBranchOffice.banderaId + ',';
                itm = itm + '"comercioId" : ' + itemBranchOffice.comercioId + ',';
                itm = itm + '"sucursalId" : ' + itemBranchOffice.sucursalId + ',';
                itm = itm + '"banderaDescripcion" : ' + itemBranchOffice.banderaDescripcion + ',';
                itm = itm + '"sucursalNombre" : ' + itemBranchOffice.sucursalNombre + ',';
                itm = itm + '"sucursalTipo" : ' + itemBranchOffice.sucursalTipo + ',';
                itm = itm + '"comercioRazonSocial" : ' + itemBranchOffice.comercioRazonSocial + ',';
                itm = itm + '"direccion" : ' + itemBranchOffice.direccion + ',';
                itm = itm + '"localidad" : ' + itemBranchOffice.localidad + ',';
                itm = itm + '"provincia" : ' + itemBranchOffice.provincia + ',';
                itm = itm + '"lat" : ' + itemBranchOffice.lat + ',';
                itm = itm + '"lng" : ' + itemBranchOffice.lng;*/
            
            var itm_1 = {
                "id": itemBranchOffice.id,
                "banderaId": itemBranchOffice.banderaId,
                "comercioId": itemBranchOffice.comercioId,
                "sucursalId": itemBranchOffice.sucursalId,
                "banderaDescripcion": itemBranchOffice.banderaDescripcion,
                "sucursalNombre": itemBranchOffice.sucursalNombre,
                "sucursalTipo": itemBranchOffice.sucursalTipo,
                "comercioRazonSocial": itemBranchOffice.comercioRazonSocial,
                "direccion": itemBranchOffice.direccion,
                "localidad": itemBranchOffice.localidad,
                "provincia": itemBranchOffice.provincia,
                "lat": itemBranchOffice.lat,
                "lng": itemBranchOffice.lng
            }
            
            console.log(itm_1);
            $scope.arrAddSucursal.push(itm_1);
            console.log($scope.arrAddSucursal);
        }
    };

})