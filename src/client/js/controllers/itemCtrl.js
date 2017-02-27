'use strict';

angular.module('gw2Calc').controller('ItemController', ['$stateParams', 'searchAPI',

    function ($stateParams, searchAPI) {

        var vm = this;

        // Will be populate from the state params object 
        vm.searchValue = null;

        /** 
         * Data object that will be displayed to the user (/search/:id) 
         */
        vm.item = {
            data: null,
            commerce: null,
            recipeData: null
        };

        /** 
         * Data object that will be displayed to the user (/search/:name) 
         */
        vm.searchResults = null;

        vm.searchError = {
            message: null,
            noCommerce: false,
            noRecipe: false
        };

        // Used to toggle the loading GIF's visibility
        vm.searchingForItem = true;

        if ($stateParams.item) {
            vm.searchValue = $stateParams.item;
        }
        var searchCallback = searchAPI.query({
                item: vm.searchValue
            },
            // On Success
            function (results) {
                // Hides the loading GIF 
                vm.searchingForItem = false;

                // Handles data depending on whether the user searched using ID/Name
                if (!isNaN(vm.searchValue)) {
                    if (!results.data.commerce) {
                        vm.searchError.noCommerce = true;
                    }

                    // Hides the div that displays the recipe data
                    if (!results.recipes) {
                        vm.searchError.noRecipe = true;
                    }

                    vm.item = {
                        data: results.data,
                        commerce: results.data.commerce || null,
                        recipeData: results.recipes
                    };
                } else {
                    // Expect an object array to return.
                    vm.searchResults = results.data;
                }

            }).$promise.catch(
            // On Failure
            function (err) {
                vm.searchingForItem = false;
                vm.searchError.message = err.data;
            });

    }
]);