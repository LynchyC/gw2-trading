// src/server/controllers/items.server.controller

'use strict';

const apiUtils = require('./../utils/apiUtils.js');
const db = require('./../db/index.js');

/**
 * Function to build the data object that is sent back to the user
 */

function getItemData(id) {

    return new Promise((resolve, reject) => {

        db.getItemByID(id)
            .then(dbResult => {
                if (dbResult) {
                    return dbResult;
                } else {
                    return itemAPISearch(id)
                        .then(itemData => {
                            return commerceAPISearch(itemData);
                        })
                        .then(commerceData => {
                            return db.addItem(commerceData);
                        });
                }
            })
            .then(dbResult => {
                if (dbResult.commerce) {
                    const coinUtil = require('./../utils/coinUtils.js');
                    dbResult.commerce.buys = coinUtil.transformCommerceObject(dbResult.commerce.buys);
                    dbResult.commerce.sells = coinUtil.transformCommerceObject(dbResult.commerce.sells);
                }

                resolve(dbResult);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function itemAPISearch(id) {

    return new Promise((resolve, reject) => {
        // Retrieves GW2 API item data
        apiUtils.gw2APIData('items/', id)
            .then((item) => {

                // Only gather the properties needed
                let itemData = item;
                itemData.itemID = item.id;
                itemData.dateCreated = new Date();
                delete itemData.id;

                // On to the next one...
                resolve(itemData);

            }).catch((error) => reject(error));
    });
}

function commerceAPISearch(item) {
    return new Promise((resolve, reject) => {

        // Retrieves GW2 API commerce data
        apiUtils.gw2APIData('commerce/prices/', item.itemID)
            .then(function(commerceResult) {

                if (commerceResult !== null) {
                    item.commerce = commerceResult;

                    // Combines the item data and commerce data into one object.
                    delete item.commerce.id;
                }
                resolve(item);
            }).catch(error => reject(error));
    });
}

exports.getItemData = getItemData;