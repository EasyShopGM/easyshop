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

    SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/products_wh?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3&q={"idwarehouse":"' + $rootScope.warehouse._id.$oid + '"}&s={"Estado": 1}', 'GET', '')
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


    $scope.actionProduct = function(product_) {
        console.log("action");
        console.log(product_);
        console.log(product_.Estado);
        console.log(product_._id.$oid);
    
        var estadoProduct = '';

        if (product_.Estado == '#55acee') {
            estadoProduct = '{ "$set" : { "Estado" : "green" } }';
        }
        else if (product_.Estado == 'green') {
            estadoProduct = '{ "$set" : { "Estado" : "red" } }';
        }
        else if (product_.Estado == 'D') {
            estadoProduct = '{ "$set" : { "Estado" : "#55acee" } }';
        }
        else {
            estadoProduct = '{ "$set" : { "Estado" : "#55acee" } }';
        };

        SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/products_wh/' + product_._id.$oid + '?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3', 'PUT', estadoProduct)
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

    $scope.doRefresh = function() {
        console.log("Refrescar");
        $scope.$broadcast('scroll.refreshComplete');
   
    var x;
    var imptotal = 0.0;
    var impparcial = 0.0;

    SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/products_wh?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3&q={"idwarehouse":"' + $rootScope.warehouse._id.$oid + '"}&s={"Estado": 1}', 'GET', '')
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
    };

})

.controller('warehouseslist', function($rootScope, $scope, $http, $location, $localStorage, $state, SrvCall, $ionicLoading, $ionicPopup) {


    if ($localStorage.userloged) {

        $scope.warehouse = [{}];
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

    $scope.share = function(warehouse_) {
        console.log("Shared");
        console.log(warehouse_);
        
        
        
        
        console.log(warehouse_._id.$oid);
        console.log(warehouse_.users);
        
        $scope.shareds = warehouse_.users;
        
        
         var myPopup = $ionicPopup.show({
                template:                '<ion-list ng-repeat = "shared in shareds">' +
                           '<ion-checkbox type="checkbox" ng-model="warehouse.selected" ng-true-value="shared" ng-false-value="">{{shared}}</ion-checkbox>' +
                         '</ion-list>',
                title: "Comparti tu lista",
                subTitle: "",
                scope: $scope,
                buttons: [{
                    text: 'Cancelar'
                }, {
                    text: '<b>Confirmar</b>',
                    type: 'button-calm',
                    onTap: function(e) {
                        console.log("paso por el confirm del shared");
                    }
                }]
            });
        

        
        console.log(warehouse_._id.$oid);
        console.log(warehouse_.users);
        
        var countShared = '{"$set":{"users":["magu_ta@yahoo.com.ar","gustavo.arenas73@gmail.com","gustavoalbert.arenas73@gmail.com"]}}';
        SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/warehouses/' + warehouse_._id.$oid + '?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3', 'PUT', countShared)
            .success(function(resp) {
                $ionicLoading.hide();
                //$scope.doRefresh();                

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
                    SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/warehouses/' + warwhouse._id.$oid + '?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3', 'DELETE', '')
                        .success(function(resp) {
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: 'Almacen',
                                template: 'Se ha eliminado la almacen',
                                okText: 'OK!'
                            });
                            $scope.doRefresh();
                            SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/products_wh?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3', 'PUT', '[{"idwarehouse": "' + warwhouse._id.$oid + '"}]')
                                .success(function(resp) {
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        title: 'Almacen',
                                        template: 'Se ha eliminado la almacen',
                                        okText: 'OK!'
                                    });
                                    //$scope.doRefresh();
                                })
                                .error(function(resp) {
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        title: 'Ups!',
                                        template: resp,
                                        okText: 'OK!'
                                    });
                                });
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

                            var newWarehouese = '{"description": "' + $scope.warehouse.nombre + '","users": ["' + $localStorage.userloged.email + '"],"date_purchase": "","estado": "#55acee"}';
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
                console.log($scope.userRegister.eMail);
                SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/profileusers?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3', 'POST', {
                            "email": $scope.userRegister.eMail,
                            "photo": "http:\\",
                            "active":"1",
                            "logined": 0,
                            "newswarehouse": "",
                            "newsprpducts": ""
                        }
                    )
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
    /*
        SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/warehouses?q={"users":"gustavo.arenas73@gmail.com"}&apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3', 'GET', '')
            .success(function(resp) {
                $ionicLoading.hide();
                $scope.wherehausespopup = resp;
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
    $scope.findproduct = function(marca_, product_) {
        $ionicLoading.show({
            template: 'Cargando...'
        });

        $scope.products = [];

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
        console.log("addlist 1era linea");
        console.log(product_);
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

                            //Agrega el producto a la lista seleccionada
                            //acaaaaaa
                            console.log("Agrega el producto a la lista seleccionada");
                            //console.log($scope.data.oid);

                            console.log("el string de producto");

                            var newProduct_wh = '{"idwarehouse":"' + $scope.data.oid + '","marca":"' + product_.marca + '","id":"' + product_.id + '","precioMax":' + product_.precioMax + ',"precioMin":' + product_.precioMin + ',"nombre":"' + product_.nombre + '","presentacion":"' + product_.presentacion + '","cantSucursalesDisponible":' + product_.cantSucursalesDisponible + ',"quantity":' + $scope.data.cantidad + ',"Estado":"P"}';
                            console.log(newProduct_wh);
                            SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/products_wh?apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3', 'POST', newProduct_wh)
                                .success(function(resp) {
                                    $ionicLoading.hide();
                                    $scope.products = resp;
                                    $ionicPopup.alert({
                                        title: 'El producto fue agregado a la lista.',
                                        template: "",
                                        okText: 'OK!'
                                    });
                                    console.log("v2");
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
                            console.log("v3");
                        }
                        console.log("v4");
                    }
                }]
            });
            console.log("v5");
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
        console.log("v6");
    };

    $scope.assignwarehome = function() {
        $scope.cont = {};
        $scope.warehousedata = {};


        console.log("en find");

        //SrvCall.async('dummys/warehouse.json', 'GET', '')
        SrvCall.async('https://api.mlab.com/api/1/databases/heroku_jkpwwrbz/collections/warehouses?q={"users":"' + $localStorage.userloged.email + '"}&apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3', 'GET', '')
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
                    console.log("v1");
                    $scope.data.almacen = itemrecuperado.substring(0, itemrecuperado.indexOf(" | "));
                    $scope.data.oid = itemrecuperado.substring(itemrecuperado.indexOf(" | ") + 3, itemrecuperado.length - 2);
                }
            }]

        });
        console.log("v7");
        //myPopup.then(function(product_) {

        //});

    };



})