// ./test/itemTest.js
/*jshint expr: true*/

'use strict';

var chai = require('chai');
var axios = require('axios');
var expect = chai.expect;
var itemCtrl = require('./../src/server/controllers/items.server.controller.js');
var apiUtils = require('./../src/server/utils/apiUtils.js');

chai.should();

describe('Item Search API', () => {

    let url;

    beforeEach(() => {
        url = 'http://localhost:1337/item?itemID=';
    });

    it('should return a status code of 200 when passing a valid itemID', (done) => {

        url = `${url}136`;

        axios.get(url)
            .then((response) => {
                expect(response.statusCode).to.equal(200);
            });

        done();
    });

    it('should return a status code of 400 when itemID is blank', (done) => {
        axios.get(url)
            .then((response) => {
                expect(response.statusCode).to.equal(400);
            });

        done();
    });
});

describe('Function to retrieve GW2 API ITEM data', () => {

    it('should succesfully retrive an ITEM data object for a valid ID ', (done) => {
        apiUtils.gw2APIData('items/', 136)
            .then((response) => {
                expect(response).to.be.an('object');
                expect(response).to.have.property('icon');
            });

        done();
    });

    it('should return a error object with no data when retrieving ITEM data of an invalid ID', (done) => {
        apiUtils.gw2APIData('items/', 19982)
            .then((response) => {
                expect(response).to.not.exist;
            }).catch((error) => {
                expect(error).to.exist;
                expect(error.title).to.equal('Item ID does not exist. Please check and try again.');
            });

        done();
    });

});

describe('Function to retrieve GW2 API COMMERCE data', () => {

    it('should succesfully retrive a PRICE data object for a valid ID ', (done) => {
        apiUtils.gw2APIData('commerce/prices/', 136)
            .then((response) => {
                expect(response).to.be.an('object');
                expect(response).to.have.property('buys');

            });

        done();
    });

    it('should return null when retrieving PRICE data of an invalid ID', (done) => {
        apiUtils.gw2APIData('commerce/prices/', 13982).then((response) => {
            expect(response).to.be.null;
        }).catch((error) => {
            expect(error).to.not.exist;
        });

        done();
    });

});