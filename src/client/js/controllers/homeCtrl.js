(function() {
    'use strict';

    angular.module('gw2Calc').controller('HomeController', HomeController);

    HomeController.$inject = ['$scope','$timeout'];

    function HomeController($scope,$timeout) {

        $scope.item = {
            ID: null,
            Name: 'TODO'
        };

        $scope.searchingForItem = false;

        $scope.getItem = function() {
            $scope.searchingForItem = true;

            $timeout(function() {
                $scope.searchingForItem = false;
            }, 5000);
        };

    }

}());