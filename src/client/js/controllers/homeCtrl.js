'use strict';

angular.module('gw2Calc').controller('HomeController', ['$scope', '$state',

    function($scope, $state) {

        $scope.itemID = null;

        $scope.getItem = function() {
            $state.go('home.search', {
                itemID: $scope.item.ID
            });
        };

    }
]);