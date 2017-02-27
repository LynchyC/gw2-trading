angular.module('gw2Calc')
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                controller: 'HomeController',
                controllerAs: 'vm',
                templateUrl: '../views/home.html'
            })

            .state('home.search', {
                url: '^/search/:item',
                controller: 'ItemController',
                templateUrl: function($stateParams) {
                    if(!isNaN($stateParams.item)) {
                        return '../views/searchID.html'; 
                    } else {
                        return '../views/searchList.html';
                    }
                }, 
                params: {
                    item: null
                }
            });

        $locationProvider.html5Mode({
            enabled: true
        });
    });