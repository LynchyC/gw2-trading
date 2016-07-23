// ./test/recipeTest.js
/*jshint expr: true*/

'use strict';

var chai = require('chai');
var axios = require('axios');
var expect = chai.expect;
var itemCtrl = require('./../src/server/controllers/items.server.controller.js');
var recipeCtrl = require('./../src/server/controllers/recipe.server.controller.js');
var apiUtils = require('./../src/server/utils/apiUtils.js');

chai.should();

describe('Function to retrieve GW2 API RECIPE data', () => {

    it('should return an array of recipe IDs when retrieving RECIPE OUTPUT data of a valid ID', (done) => {
        apiUtils.gw2APIData('recipes/search?output=', 50065)
            .then((response) => {
                expect(response).to.exist;
                expect(response).to.be.an('array');
            });

        done();
    });

    it('should return an object of a recipe when retrieving RECIPE OUTPUT data of a valid ID', (done) => {
        apiUtils.gw2APIData('recipes/', 7319)
            .then((response) => {
                expect(response).to.exist;
                expect(response).to.be.an('object');
                expect(response).to.have.property('disciplines');
                expect(response.disciplines).to.be.an('array');
            });

        done();
    });

});

describe('Function to build recipe data', () => {

    it('should return a valid object', (done) => {
        recipeCtrl.getRecipeData(50065, function(err, results) {
            expect(err).to.not.exist;
            expect(results).to.exist;
            expect(results).to.be.an('object');
        });

        done();
    });

});