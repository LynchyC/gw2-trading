'use strict';

angular.module('gw2Calc').controller('HomeController', ['$scope', '$state',

    function($scope, $state) {

        $scope.search = null;

        $scope.getItem = function() {
            $state.go('home.search', {
                item: $scope.search
            });
        };

        $scope.checkValidity = function() {
            if(isNaN($scope.search)) {
                if($scope.search.length < 3) {
                    return true;
                }
            } 

            return false;
        };

    }
]);