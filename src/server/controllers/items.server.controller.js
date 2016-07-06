// src/server/controllers/items.server.controller

'use strict';

var apiUtils = require('./../utils/apiUtils.js');

/**
 * Function to build the data object that is sent back to the user
 */

function getItemData (id, next) {

    var itemData = {
        _id: id,
        name: '',
        img: ''
    };

    apiUtils.gw2APIData('items/', itemData._id, function(err, results) {
        if (err)
            next(err);
        else {

            itemData = Object.assign(itemData, {
                name: results.name,
                img: results.icon
            });

            getPriceData(itemData, function(err, results) {
                if (err) {
                    next(err, itemData);
                } else {
                    // This is a completed itemData object 
                    // (if the ID that is passed through has both valid item and commerce data from the GW2 API)
                    next(null, results);
                }
            });
        }
    });
}

function getPriceData (item, next) {

    apiUtils.gw2APIData('commerce/prices/', item._id, function(err, results) {
        if (err) {
            next(err);
        } else {

            if (results === null) {
                next(null, item);
            } else {

                item.buys = converPrice(results.buys);
                item.sells = converPrice(results.sells);
                next(null, item);
            }
        }
    });
}

function converPrice(transaction) {
    var coinUtils = require('./../utils/coinUtils.js');

    transaction.unit_price = coinUtils.calucatePriceRatio(transaction.unit_price);
    return transaction;
}

exports.getItemData = getItemData;
exports.getPriceData = getPriceData;