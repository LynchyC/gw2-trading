// src/server/controllers/items.server.controller

'use strict';

var apiUtils = require('./../utils/apiUtils.js');

/**
 * Function to build the data object that is sent back to the user
 */

function getItemData(id, next) {

    var p = new Promise((resolve, reject) => {

        // Retrieves GW2 API item data
        apiUtils.gw2APIData('items/', id)
            .then((item) => {

                // Only gather the properties needed
                let itemData = {
                    _id: id,
                    name: item.name,
                    img: item.icon
                };

                // On to the next one...
                resolve(itemData);

            }).catch((error) => {
                handleError(error);
            });
    });

    p.then(function(item) {

        // Retrieves GW2 API commerce data
        apiUtils.gw2APIData('commerce/prices/', item._id)
            .then(function(commerceResult) {

                if (commerceResult === null) {
                    next(null, item);
                } else {

                    // Converts the unit_price property from the API
                    // into a Gold/Silver/Bronze ratio
                    item.buys = convertPrice(commerceResult.buys);
                    item.sells = convertPrice(commerceResult.sells);

                    // Combines the item data and commerce data into one object.
                    let gw2Result = Object.assign(commerceResult, item);
                    next(null, gw2Result);
                }

            }).catch((err) => {
                handleError(err);
            });
    });

    p.catch((err) => {
        handleError(err);
    });

    function handleError(error) {
        next(error);
    }
}

/**
 * Converts the price returned from the commerce API and
 * calculates the Gold/Silver/Bronze ratio for item
 */

function convertPrice(transaction) {
    var coinUtils = require('./../utils/coinUtils.js');

    
    let itemPrice = {
        quantity: transaction.quantity,
        price: transaction.unit_price // jshint ignore:line
    };

    itemPrice.price = coinUtils.calucatePriceRatio(itemPrice.price);
    return itemPrice;
}

exports.getItemData = getItemData;
// exports.getPriceData = getPriceData;