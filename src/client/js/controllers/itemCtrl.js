'use strict';

angular.module('gw2Calc').controller('ItemController', ['$state', '$stateParams', 'searchAPI', 'notificationService',

    function ($state, $stateParams, searchAPI, notificationService) {

        var vm = this;

        // Will be populate from the state params object 
        vm.searchValue = null;

        // Clear all notifications on screen
        notificationService.clear();

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
        vm.filteredResults = null;

        // Variable binded to current page number for angular pagination directive
        vm.currentPage = 1;

        vm.setPage = function () {
            var start = ((vm.currentPage - 1) * 25), // 25 => Number of items to show between pagination pages
                end = start + 25;
            vm.filteredResults = vm.searchResults.slice(start, end);
        };


        // Used to toggle the loading GIF's visibility
        vm.searchingForItem = true;

        if ($stateParams.item) {
            vm.searchValue = $stateParams.item;
        }

        var searchItem = searchAPI.query({
                item: vm.searchValue
            },
            // On Success
            function (results) {
                // Hides the loading GIF 
                vm.searchingForItem = false;

                // Handles data depending on whether the user searched using ID/Name
                if (!isNaN(vm.searchValue)) {
                    if (!results.data.commerce) {
                        notificationService.notifyInfo('Commerce data is not available for this item.', 'Message!');
                    }

                    // Displays notification if there is no recipe data
                    if (!results.recipes) {
                        notificationService.notifyInfo('Recipe data is not available for this item.', 'Message!');
                    }

                    vm.item = {
                        data: results.data,
                        commerce: results.data.commerce || null,
                        recipeData: results.recipes
                    };
                } else {
                    if (results.data.length === 1) {
                        $state.go('home.search', {
                            item: results.data[0].itemID
                        });
                    } else if (results.data.length === 0) {
                        vm.errorMessage = '0 Results were found for \'' + vm.searchValue + '\'';
                    }

                    // Expect an object array to return.
                    vm.searchResults = results.data;

                    // Pagination: Total items attribute
                    vm.totalItems = vm.searchResults.length;
                    // Pagination: Number of pages to display
                    vm.numPages = Math.ceil(vm.searchResults.length / 25);
                    
                    vm.setPage(); // Show the first page of results
                }

            }).$promise.catch(
            // On Failure
            function (err) {
                vm.searchingForItem = false;
                vm.errorMessage = err.data ? err.data : 'Oops! Something went wrong!';
            });

    }
]);