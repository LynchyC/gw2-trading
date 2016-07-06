// ./test/itemTest.js

'use strict';

var chai = require('chai');
var request = require('request');
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

        request(url, (err, res, body) => {
            expect(res.statusCode).to.equal(200);
        });

        done();
    });

    it('should return a status code of 400 when itemID is blank', (done) => {
        request(url, (err, res, body) => {
            expect(res.statusCode).to.equal(400);
        });

        done();
    });
});

describe('Function to retrieve GW2 API data', () => {

    it('should succesfully retrive an ITEM data object for a valid ID ', (done) => {
        apiUtils.gw2APIData('items/', 136, (err, results) => {
            expect(err).to.not.exist;
            expect(results).to.exist;
            expect(results).to.be.an('object');
            done();
        });
    });

    it('should succesfully retrive a PRICE data object for a valid ID ', (done) => {
        apiUtils.gw2APIData('commerce/prices/', 136, (err, results) => {
            expect(err).to.not.exist;
            expect(results).to.exist;
            expect(results).to.be.an('object');
            done();
        });
    });

    it('should return a error object with no data when retrieving ITEM data of an invalid ID', (done) => {
        apiUtils.gw2APIData('items/', 19982, (err, results) => {
            expect(err).to.exist;
            expect(err).to.be.a('object');
            expect(results).to.not.exist;
            done();
        });
    });

    it('should return null when retrieving PRICE data of an invalid ID', (done) => {
        apiUtils.gw2APIData('commerce/prices/', 13982, (err, results) => {
            expect(err).to.be.null;
            expect(results).to.be.null;
            done();
        });
    });
});
