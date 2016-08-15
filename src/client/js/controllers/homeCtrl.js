'use strict';

angular.module('gw2Calc').controller('HomeController', ['$scope', '$state',

    function($scope, $state) {

        $scope.search = null;

        $scope.getItem = function() {
            $state.go('home.search', {
                item: $scope.search
            });
        };

    }
]);