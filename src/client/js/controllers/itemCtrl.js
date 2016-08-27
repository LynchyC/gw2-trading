'use strict';

angular.module('gw2Calc').controller('ItemController', ['$scope', '$stateParams', 'searchAPI',

    function($scope, $stateParams, searchAPI) {

        $scope.item = {
            data: null,
            commerce: null,
            recipeData: null
        };

        $scope.searchValue = null;
        $scope.searchResults = null;

        $scope.searchError = {
            message: null,
            noCommerce: false,
            noRecipe: false
        };

        $scope.searchingForItem = true;

        if ($stateParams.item) {
            $scope.searchValue = $stateParams.item;
        }
        var searchCallback = searchAPI.query({
                item: $scope.searchValue
            },
            // On Sucess
            function(results) {
                $scope.searchingForItem = false;

                if (!isNaN($scope.searchValue)) {
                    if (!results.data.commerce) {
                        $scope.searchError.noCommerce = true;
                    }

                    if (!results.recipes) {
                        $scope.searchError.noRecipe = true;
                    }

                    $scope.item = {
                        data: results.data,
                        commerce: results.data.commerce || null,
                        recipeData: results.recipes
                    };
                } else {
                    $scope.searchResults = results.data;
                }

            }).$promise.catch(
            // On Failure
            function(err) {
                $scope.searchingForItem = false;
                $scope.searchError.message = err.data;
            });

    }
]);