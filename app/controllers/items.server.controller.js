// .app/controllers/items.server.controller

'use strict';

var apiUtils = require('./../utils/apiUtils.js');
var coinUtils = require('./../utils/coinUtils.js');

/**
 * Function to build the data object that is sent back to the user
 */

exports.getItemData = (id, next) => {

    // Validates the users' request. 
    if (exports.validateID(id)) {

        next({
            title: "Error has occured",
            cssClass: "alert alert-danger",
            message: "Invalid ID. Please try again."
        }, null);

    } else {

        let itemData = {
            _id: id,
            name: '',
            img: '',
            buys: {
                quantity: null,
                price: null
            },
            sells: {
                quantity: null,
                price: null
            }
        };

        apiUtils.gw2APIData(`items/`, itemData._id, (err, results) => {
            if (err) {

                next({
                    title: err.title,
                    message: err.message
                }, null);

            } else {

                itemData = Object.assign(itemData, {
                    name: results.name,
                    img: results.icon
                });

                exports.getPriceData(itemData, (err, results) => {
                    if (err) {
                        next(null, itemData);
                    } else {
                        // This is a completed itemData object 
                        // (if the ID that is passed through has both valid item and commerce data from the GW2 API)
                        next(null, results);
                    }
                });
            }
        });
    }
};

exports.getPriceData = (itemData, next) => {

    apiUtils.gw2APIData(`commerce/prices/`, itemData._id, (err, results) => {
        if (err) {
            next(err, null);
        } else {

            itemData = Object.assign(itemData, {
                buys: {
                    quantity: results.buys.quantity,
                    price: coinUtils.calucatePriceRatio(results.buys.unit_price)
                },
                sells: {
                    quantity: results.sells.quantity,
                    price: coinUtils.calucatePriceRatio(results.sells.unit_price) 
                }
            });

            next(null, itemData);
        }
    });
};

/**
 * Make sure that the ID is actually a number. Trust me ... I have tried passing text before.
 */
exports.validateID = (id) => {
    return isNaN(parseInt(id));
};