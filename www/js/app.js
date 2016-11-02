// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

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

	.state('app.home', {
        url: "/home",
        views: {
            'menuContent': {
                templateUrl: "templates/home.html",
                controller: 'Home'
            }
        }
    })
	
	.state('app.myorder', {
        url: "/myorder",
        views: {
            'menuContent': {
                templateUrl: "templates/myorder.html",
                controller: 'myorder'
            }
        }
    })
	.state('app.orderdetail', {
        url: "/orderdetail",
        views: {
            'menuContent': {
                templateUrl: "templates/orderdetail.html",
                controller: 'orderdetail'
            }
        }
    })
	.state('app.productlist', {
        url: "/productlist",
        views: {
            'menuContent': {
                templateUrl: "templates/productlist.html",
                controller: 'productlist'
            }
        }
    })
	.state('app.cart', {
        url: "/cart",
        views: {
            'menuContent': {
                templateUrl: "templates/cart.html",
                controller: 'cart'
            }
        }
    })
	
	
	.state('main_page', {
        url: "/main_page",
				
                templateUrl: "templates/main.html",
                controller: 'login'
            
    })
	.state('register', {
        url: "/register",
       
                templateUrl: "templates/register.html",
                controller: 'register'
         
    })
	.state('shipping', {
        url: "/shipping",
       
                templateUrl: "templates/shipping.html",
                controller: 'shipping'
       
    })
	
	
	
	
	
	.state('app.productdetail', {
        url: "/productdetail",
        views: {
            'menuContent': {
                templateUrl: "templates/productdetail.html",
                controller: 'productdetail'
            }
        }
    })

		


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
});
