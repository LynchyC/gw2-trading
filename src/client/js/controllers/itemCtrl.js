'use strict';

angular.module('gw2Calc').controller('ItemController', ['$scope', '$stateParams', 'searchAPI',

    function($scope, $stateParams, searchAPI) {

        $scope.item = {
            ID: null,
            data: null,
            recipeData: null
        };

        $scope.searchError = {
            message: null,
            noCommerce: false,
            noRecipe: false
        };

        $scope.searchingForItem = true;

        if ($stateParams.item) {
            $scope.item.ID = $stateParams.item;
        }
        var searchCallback = searchAPI.query({
                item: $scope.item.ID
            },
            // On Sucess
            function(results) {
                $scope.searchingForItem = false;
                if (!results.data.buys && !results.data.sells) {
                    $scope.searchError.noCommerce = true;
                }

                if(!results.recipes) {
                    $scope.searchError.noRecipe = true;
                }

                $scope.item.data = results.data;
                $scope.item.recipeData = results.recipes;
            }).$promise.catch(
            // On Failure
            function(err) {
                $scope.searchingForItem = false;
                $scope.searchError.message= err.data;
            });

    }
]);