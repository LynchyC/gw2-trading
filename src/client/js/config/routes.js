angular.module('gw2Calc')
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                controller: 'HomeController',
                templateUrl: 'js/views/home.html'
            });

        $locationProvider.html5Mode({
            enabled: true
        });
    });