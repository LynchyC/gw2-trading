// .app/controllers/items.server.controller

'use strict';

var request = require('request');

/**
 * Function to build the data object that is sent back to the user
 */

exports.getItemData = (req, res) => {
    let id = req.query.itemID;

    // Validates the users' request. 
    if (exports.validateID(id)) {

        exports.returnToSender(res, {
            status: 400,
            title: "Error has occured",
            cssClass: "alert alert-danger",
            message: "Invalid ID. Please try again."
        });

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

        exports.gw2APIData(`items/`, itemData._id, (err, results) => {
            if (err) {

                exports.returnToSender(res, {
                    status: err.manuallyCreated ? err.status : 404,
                    title: "Error has Occured",
                    cssClass: "alert alert-danger",
                    message: err.manuallyCreated ? err.message : err
                });

            } else {

                itemData = Object.assign(itemData, {
                    name: results.name,
                    img: results.icon
                });

                exports.getPriceData(itemData, (err, results) => {
                    if (err) {

                        if (err.manuallyCreated) {
                            
                            exports.returnToSender(res, {
                                status: err.status,
                                title: err.title,
                                cssClass: err.cssClass,
                                message: err.message,
                                data: itemData
                            });
                            
                        } else {
                            exports.returnToSender(res, {
                                status: 404,
                                title: 'Error has occured',
                                cssClass: "alert alert-danger",
                                message: err
                            });
                        }

                    } else {
                        // This is a completed itemData object 
                        // (if the ID that is passed through has both valid item and commerce data from the GW2 API)
                        exports.returnToSender(res, {
                            status: 200,
                            title: "Your Searched Items",
                            data: results
                        });
                    }
                });
            }
        });
    }
};

exports.getPriceData = (itemData, next) => {

    exports.gw2APIData(`commerce/prices/`, itemData._id, (err, results) => {
        if (err) {
            next(err, null);
        } else {
            itemData = Object.assign(itemData, {
                buys: {
                    quantity: results.buys.quantity,
                    price: results.buys.unit_price
                },
                sells: {
                    quantity: results.sells.quantity,
                    price: results.sells.unit_price
                }
            });

            next(null, itemData);
        }
    });
};

/**
 * Goes off to the GW2 API (depending on whats appended at the end of the url) 
 * and retrieves the relevant item/commerce data.
 */
exports.gw2APIData = (apiSearch, id, next) => {

    request(`https://api.guildwars2.com/v2/${apiSearch}/${id}`, (err, response, body) => {
        if (err) {
            next(err, null);
        } else if (JSON.parse(body).text == 'no such id') {
            
            /**
             * Some error return objects, instead of sending my manually created error message each time. 
             */
            
            let errObject;

            switch (apiSearch) {
                case 'items/':
                    errObject = {
                        manuallyCreated: true,
                        status: 400,
                        message: 'ID does not exist. Please check your ID.'
                    };
                    break;
                case 'commerce/prices/':
                    errObject = {
                        manuallyCreated: true,
                        status: 400,
                        title: "Your Searched Items",
                        cssClass: "alert alert-info",
                        message: "No commerce data available for this ID"
                    };
                    break;
                default:
                    errObject = {
                        manuallyCreated: true,
                        status: 400,
                        title: 'You are pretty amazing to end up here.',
                        cssClass: "alert alert-success",
                        message: "How did you do this?"
                    };
                    break;
            }

            next(errObject, null);
        } else if (!err && response.statusCode == 200) {
            next(null, JSON.parse(body));
        }
    });
};

/**
 * Make sure that the ID is actually a number. Trust me ... I have tried passing text before.
 */
exports.validateID = (id) => {
    return isNaN(parseInt(id));
};


/**
 * Takes a response a return object to render the index view.
 */
exports.returnToSender = (res, retObject) => {
    res.status(retObject.status);
    res.render('index', {
        layout: false,
        title: retObject.title,
        cssClass: retObject.cssClass,
        error: retObject.message,
        data: retObject.data
    });
};