(function() {

    'use strict';

    angular.module('gw2Calc').factory('searchAPI', ['$resource',
        function($resource) {
            return $resource('/api/item/:itemID', {
                itemID: '@itemID'
            }, {
                query: {
                    method: 'GET',
                    isArray: false
                }
            });
        }
    ]);
}());