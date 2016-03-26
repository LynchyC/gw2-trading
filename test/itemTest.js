// ./test/itemTest.js

'use strict';

var chai = require('chai');
var request = require('request');
var expect = chai.expect;
var itemCtrl = require('../app/controllers/items.server.controller');

chai.should();

describe('Item Search API', () => {

    var url;

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
        itemCtrl.gw2APIData('items/',1363, (err, results) => {
            expect(err).to.not.exist;
            expect(results).to.exist;
            expect(results).to.be.an('object');
            done();
        });
    });

    it('should succesfully retrive a PRICE data object for a valid ID ', (done) => {
        itemCtrl.gw2APIData('commerce/prices/',136, (err, results) => {
            expect(err).to.not.exist;
            expect(results).to.exist;
            expect(results).to.be.an('object');
            done();
        });
    });

    it('should return an boolean type error when retrieving ITEM data of an invalid ID', (done) => {
        itemCtrl.gw2APIData('items/',19982, (err, results) => {
            expect(err).to.exist;
            expect(err.manuallyCreated).to.be.a('boolean');
            expect(results).to.not.exist;
            done();
        });
    });

    it('should return an boolean type error when retrieving PRICE data of an invalid ID', (done) => {
        itemCtrl.gw2APIData('commerce/prices/',19982, (err, results) => {
            expect(err).to.exist;
            expect(err.manuallyCreated).to.be.a('boolean');
            expect(results).to.not.exist;
            done();
        });
    });
});

describe('Function to validate item ID', () => {
   
   var id;
   
   beforeEach(()=>{
      id = 0; 
   });
   
   it('should return false when passing in a number', (done) => {
       id = 136;
       var result = itemCtrl.validateID(id);
       expect(result).to.be.false; 
       done();      
   });
   
   it('should return true when passing in a empty ID', (done) => {
      id = '';
      var result = itemCtrl.validateID(id);
      expect(result).to.be.true;
      done();  
   });
    
});