angular.module('starter.controllers', ['ionic', 'ngMessages'])
    .controller('AppCtrl', function($localStorage, $state, $rootScope, $scope, $ionicModal, $timeout, $http) {
        // Form data for the login modal
        $scope.logout = function() {
            $localStorage.$reset();
            //$rootScope.customdataloged = '';
            //$rootScope.tokenloged = '';
            //$rootScope.userloged = '';
            //$state.go("login");
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

        //    console.log("En Lista de Productos para Comprar");
        $scope.warehousetitle = $rootScope.warehouse.description;
        //    console.log($rootScope.warehouse.description);
        //    console.log("El ID");
        //    console.log($rootScope.warehouse._id.$oid);
        var x;
        var imptotal = 0.0;
        var impparcial = 0.0;

        SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/products_wh?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3&q={"idwarehouse":"' + $rootScope.warehouse._id.$oid + '"}', 'GET', '')
            .success(function(resp) {
                $ionicLoading.hide();
                $scope.products = resp;
                for (x in $scope.products) {
                    imptotal = imptotal + ($scope.products[x].precioMax * $scope.products[x].quantity);
                    if ($scope.products[x].estado == "C") {
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



        $scope.actionProduct = function(id_) {
            console.log("action");
            console.log(id_);
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

            SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/warehouses?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3&q={"users":"' + $localStorage.userloged.email + '"}', 'GET', '')
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

        /*
        $scope.moveItem = function(item, fromIndex, toIndex) {
            console.log("acac");
            $scope.items.splice(fromIndex, 7);
            $scope.items.splice(toIndex, 0, item);
        };
        */

    })

.controller('warehouseslist', function($rootScope, $scope, $http, $location, $localStorage, $state, SrvCall, $ionicLoading, $ionicPopup) {

    //Inicializa la variable para que no rompa si viene vacio
    $scope.warehouse = [{}];

    //Llama al servicio con los parametros para que traiga las almacenes que tiene asiganado el usuario
    //dummys/warehouse.json
    //https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/warehouse?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3

    //https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/warehouse?q={"email": "' + $localStorage.userloged.email +  '"}&apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3    
    //https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/warehouse?q={"email":"gustavo.arenas73@gmail.com"}&apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3

    //SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/warehouse?q={"email": "' + $localStorage.userloged.email +  '"}&apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3', 'GET', '')
    SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/warehouses?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3&q={"users":"' + $localStorage.userloged.email + '"}', 'GET', '')
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
        console.log("toma la almacen");
        console.log(warwhouse);
        $rootScope.warehouse = warwhouse;
        console.log("Lo paso al root");
        console.log($rootScope.warehouse);
        //$scope.warehouse_index = warehouse._id.$oid;
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

    $scope.discard = function(warwhouse) {
        console.log("descartado" + warwhouse);
        console.log(warwhouse._id.$oid)
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
                    SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/warehouses/' + warwhouse._id.$oid + '?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3', 'DELETE', '')
                        .success(function(resp) {
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: 'Almacen',
                                template: 'Se ha eliminado la almacen',
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
        console.log("agraga alamcen");
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
                            //Llama al servicio con los parametros para que insertar en ordenes de compra el producto

                            var newWarehouese = '{"description": "' + $scope.warehouse.nombre + '","users": ["' + $localStorage.userloged.email + '"],"date_purchase": "","estado": "P"}';
                            SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/warehouses?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3', 'POST', newWarehouese)
                                .success(function(resp) {
                                    $ionicLoading.hide();
                                    $scope.products = resp;
                                    $ionicPopup.alert({
                                        title: 'La almacen fue agregada a tu usuario.',
                                        template: "",
                                        okText: 'OK!'
                                    });
                                    $scope.doRefresh();

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

                            console.log(popupNew);
                            //return popupNew;
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

    $scope.doRefresh = function() {
        console.log("Refrescar");
        $scope.$broadcast('scroll.refreshComplete');

        SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/warehouses?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3&q={"users":"' + $localStorage.userloged.email + '"}', 'GET', '')
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
})

.controller('login', function($state, $rootScope, $scope, $http, $location, SrvCallOauth, $localStorage, $ionicPopup, $ionicLoading, Base64) {


    if ($localStorage.userloged) {
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
                //$state.go("app.newsoffers");
                window.history.back();

            })

        .error(function(resp) {
            //Apaga el evento cargando
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
                $localStorage.customdataloged = $rootScope.customdataloged;
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
        //$state.go('app.newsoffers');
        window.history.back();
    }


})


.controller('register', function($state, $ionicLoading, $rootScope, $scope, $http, $location, SrvCallOauth, $localStorage, $ionicPopup) {


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
                    'foto': 'https://www.gravatar.com/avatar/90c89a212acf87b6abe02937b388e740?s=32&d=retro',
                    'profile': $scope.userRegister.shared
                }
            })
            .success(function(resp) {

                console.log(resp)
                    //Apaga el evento cargando
                $ionicLoading.hide();
                $rootScope.userloged = resp;
                //console.log($rootScope.userloged);
                //$localStorage.userLoged = $rootScope.userloged;
                $ionicPopup.alert({
                    title: 'Registration',
                    template: 'Successful',
                    okText: 'OK'

                });
                window.history.back();

            }).error(function(resp) {

                console.log(resp)
                    //Apaga el evento cargando
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




.controller('orderproduct', function($rootScope, $scope, $http, $location, $ionicPopup, $localStorage, $state, $ionicLoading, SrvCall) {


    //Inicializa la variable para que no rompa si viene vacio
    $scope.warehouse = [];

    //Llama al servicio con los parametros para que traiga las almacenes que tiene asiganado el usuario
    //https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/warehouse?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3
    //dummys/warehouse.json
    //https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/warehouse?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3

    SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/wh_products?q={"id_warehouse":"58a2029bbd966f2cc1e63761"}&apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3', 'GET', '')
        .success(function(resp) {
            $ionicLoading.hide();
            $scope.wh_products = resp;

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
        //inicia el evento cargando y bloquea la pantalla
        $ionicLoading.show({
            template: 'Cargando...'
        });

        //Inicializa la variable para que no rompa si viene vacio
        $scope.products = [];

        //console.log("https://3619otk88c.execute-api.us-east-1.amazonaws.com/prod/productos?string=" + marca_  + "&array_sucursales=10-1-5,10-3-678,11-3-1090,12-1-125,10-3-658,10-3-595,10-3-726,23-1-6225,10-3-553,10-3-626,12-1-83,10-3-727,12-1-35,10-3-326,10-3-688,10-3-733,10-3-398,12-1-90,10-3-722,10-3-643,23-1-6276,23-1-6219,23-1-6287,10-3-314,10-2-515,11-3-1047,23-1-6228,10-3-649,10-3-673,10-3-625&offset=0&limit=50&sort=-cant_sucursales_disponible");
        //Llama al servicio con los parametros para que traiga las almacenes que tiene asiganado el usuario
        SrvCall.async('https://3619otk88c.execute-api.us-east-1.amazonaws.com/prod/productos?string=' + marca_ + '&array_sucursales=10-1-5,10-3-678,11-3-1090,12-1-125,10-3-658,10-3-595,10-3-726,23-1-6225,10-3-553,10-3-626,12-1-83,10-3-727,12-1-35,10-3-326,10-3-688,10-3-733,10-3-398,12-1-90,10-3-722,10-3-643,23-1-6276,23-1-6219,23-1-6287,10-3-314,10-2-515,11-3-1047,23-1-6228,10-3-649,10-3-673,10-3-625&offset=0&limit=50&sort=-cant_sucursales_disponible', 'GET', '')
            .success(function(resp) {
                $ionicLoading.hide();
                $scope.products = resp.productos;
                //console.log(resp.productos);
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
            //            var imagenotfound = "'https://easyshop-gustavoarenas.c9users.io/img/imagenotfound.gif'";
            var myPopup = $ionicPopup.show({
                template: '<img src = https://imagenes.preciosclaros.gob.ar/productos/' + product_.id + '.jpg style="width:50%; height:50%; margin:0% auto; display:block"      onerror="this.onerror=null;this.src=' + IMAGENOTFOUND + ';"  >' +
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
                            //Llama al servicio con los parametros para que insertar en ordenes de compra el producto
                            SrvCall.async('dummys/order.json', 'get', '')
                                .success(function(resp) {
                                    $ionicLoading.hide();
                                    $scope.products = resp;
                                    $ionicPopup.alert({
                                        title: 'El producto fue agregado a la lista.',
                                        template: "",
                                        okText: 'OK!'
                                    });
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

                            console.log(popupNew);
                            //return popupNew;
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