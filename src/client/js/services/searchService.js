(function() {

    'use strict';

    angular.module('gw2Calc').factory('searchAPI', ['$resource',
        function($resource) {
            return $resource('/api/item/:item', {
                item: '@item'
            }, {
                query: {
                    method: 'GET',
                    isArray: false
                }
            });
        }
    ]);
}());