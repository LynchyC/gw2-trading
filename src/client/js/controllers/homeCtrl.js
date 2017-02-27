'use strict';

angular.module('gw2Calc').controller('HomeController', ['$state', function ($state) {
    var vm = this;
    vm.search = null;

    vm.getItem = function () {
        $state.go('home.search', {
            item: vm.search
        });
    };

    vm.checkValidity = function () {
        return !isNaN(vm.search) ? false : (vm.search.length < 3) ? true : false;
    };

}]);