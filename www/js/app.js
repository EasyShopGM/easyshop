// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 
                            'starter.controllers',
                            'starter.services', 
                            'ngStorage'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    })

	.state('app.newsoffers', {
        url: "/newsoffers",
        views: {
            'menuContent': {
                templateUrl: "templates/newsoffers.html",
                controller: 'newsoffers'
            }
        }
    })
	
/*	.state('app.myorder', {
        url: "/myorder",
        views: {
            'menuContent': {
                templateUrl: "templates/myorder.html",
                controller: 'myorder'
            }
        }
    })*/
/*	.state('app.orderdetail', {
        url: "/orderdetail",
        views: {
            'menuContent': {
                templateUrl: "templates/orderdetail.html",
                controller: 'orderdetail'
            }
        }
    })*/
	.state('app.productlist', {
        url: "/productlist",
        views: {
            'menuContent': {
                templateUrl: "templates/productlist.html",
                controller: 'productlist'
            }
        }
    })
/*	.state('app.cart', {
        url: "/cart",
        views: {
            'menuContent': {
                templateUrl: "templates/cart.html",
                controller: 'cart'
            }
        }
    })*/

	.state('login', {
        url: "/login",
                templateUrl: "templates/login.html",
                controller: 'login'
    })
    
	.state('register', {
        url: "/register",
                templateUrl: "templates/register.html",
                controller: 'register'
    })
    
	.state('shipping', {
        url: "/shipping",
            'menuContent': {
                templateUrl: "templates/shipping.html",
                controller: 'shipping'
            }
       
    })

	
/*	.state('app.productdetail', {
        url: "/productdetail",
        views: {
            'menuContent': {
                templateUrl: "templates/productdetail.html",
                controller: 'productdetail'
            }
        }
    })*/

	.state('app.userprofile', {
        url: "/userprofile",
        views: {
            'menuContent': {
                templateUrl: "templates/userprofile.html",
                controller: 'userprofile'
            }
        }
    })
		
	.state('app.shoppinglist', {
        url: "/shoppinglist/:warehouse",
        views: {
            'menuContent': {
                templateUrl: "templates/shoppinglist.html",
                controller: 'shoppinglist'
            }
        }
    })

	.state('app.warehouseslist', {
        url: "/warehouseslist",
        views: {
            'menuContent': {
                templateUrl: "templates/warehouseslist.html",
                controller: 'warehouseslist'
            }
        }
    })
    
    .state('app.orderproduct', {
        url: "/orderproduct",
        views: {
            'menuContent': {
                templateUrl: "templates/orderproduct.html",
                controller: 'orderproduct'
            }
        }
    })

    .state('app.orderproductWH', {
        url: "/orderproductWH",
        views: {
            'menuContent': {
                templateUrl: "templates/orderproductWH.html",
                controller: 'orderproductWH'
            }
        }
    })

    .state('app.collaboration', {
        url: "/collaboration",
        views: {
            'menuContent': {
                templateUrl: "templates/collaboration.html",
                controller: 'collaboration'
            }
        }
    })
    
    
    .state('app.findshare', {
        url: "/findshare",
        views: {
            'menuContent': {
                templateUrl: "templates/findshare.html",
                controller: 'findshare'
            }
        }
    })    
    
    .state('app.group', {
        url: "/group",
        views: {
            'menuContent': {
                templateUrl: "templates/group.html",
                controller: 'group'
            }
        }
    })        
    
    .state('app.resetpass', {
        url: "/resetpass",
        views: {
            'menuContent': {
                templateUrl: "templates/resetpass.html",
                controller: 'resetpass'
            }
        }
    })
    
    .state('app.branchoffice', {
        url: "/branchoffice",
        views: {
            'menuContent': {
                templateUrl: "templates/branchoffice.html",
                controller: 'branchoffice'
            }
        }
    })
    
    .state('app.typeBranchOffice', {
        url: "/typeBranchOffice",
        views: {
            'menuContent': {
                templateUrl: "templates/typeBranchOffice.html",
                controller: 'typeBranchOffice'
            }
        }
    })
   
    .state('app.branchOffices', {
        url: "/branchOffices",
        views: {
            'menuContent': {
                templateUrl: "templates/branchOffices.html",
                controller: 'branchOffices'
            }
        }
    })    
    
    
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/newsoffers');
});


