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

                    item.buys = commerceResult.buys;
                    item.sells = commerceResult.sells;

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

exports.getItemData = getItemData;
// exports.getPriceData = getPriceData;