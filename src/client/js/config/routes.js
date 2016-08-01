angular.module('gw2Calc')
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                controller: 'HomeController',
                templateUrl: 'js/views/home.html'
            })

            .state('home.search', {
                url: '^/search/:itemID',
                controller: 'ItemController',
                templateUrl: 'js/views/search.html',
                params: {
                    itemID: null
                }
            });

        $locationProvider.html5Mode({
            enabled: true
        });
    });