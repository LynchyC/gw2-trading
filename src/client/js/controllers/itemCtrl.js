'use strict';

angular.module('gw2Calc').controller('ItemController', ['$scope', '$stateParams', '$timeout',

    function($scope, $stateParams, $timeout) {

        $scope.item = {
            ID: null,
            Name: 'TODO'
        };

        $scope.searchingForItem = false;

        if ($stateParams.itemID) {
            $scope.item.ID = $stateParams.itemID;
            $scope.searchingForItem = true;

            $timeout(function() {
                $scope.searchingForItem = false;
            }, 5000);

        }

    }
]);