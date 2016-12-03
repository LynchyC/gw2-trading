'use strict';

angular.module('gw2Calc').controller('ItemController', ['$scope', '$stateParams', 'searchAPI',

    function ($scope, $stateParams, searchAPI) {

        // Will be populate from the state params object 
        $scope.searchValue = null;

        /** 
         * Data object that will be displayed to the user (/search/:id) 
         */
        $scope.item = {
            data: null,
            commerce: null,
            recipeData: null
        };

        /** 
         * Data object that will be displayed to the user (/search/:name) 
         */
        $scope.searchResults = null;

        $scope.searchError = {
            message: null,
            noCommerce: false,
            noRecipe: false
        };

        // Used to toggle the loading GIF's visibility
        $scope.searchingForItem = true;

        if ($stateParams.item) {
            $scope.searchValue = $stateParams.item;
        }
        var searchCallback = searchAPI.query({
                item: $scope.searchValue
            },
            // On Success
            function (results) {
                // Hides the loading GIF 
                $scope.searchingForItem = false;

                // Handles data depending on whether the user searched using ID/Name
                if (!isNaN($scope.searchValue)) {
                    if (!results.data.commerce) {
                        $scope.searchError.noCommerce = true;
                    }

                    // Hides the div that displays the recipe data
                    if (!results.recipes) {
                        $scope.searchError.noRecipe = true;
                    }

                    $scope.item = {
                        data: results.data,
                        commerce: results.data.commerce || null,
                        recipeData: results.recipes
                    };
                } else {
                    // Expect an object array to return.
                    $scope.searchResults = results.data;
                }

            }).$promise.catch(
            // On Failure
            function (err) {
                $scope.searchingForItem = false;
                $scope.searchError.message = err.data;
            });

    }
]);