// src/routes/index.js

'use strict';

const itemCtrl = require('./../controllers/items.server.controller.js');
const recipeCtrl = require('./../controllers/recipe.server.controller.js');

module.exports = function(app) {

    app.route('/').get(function(req, res) {
        res.render('index', {});
    });

    /**
     * Get item info from GW2 API
     */

    app.route('/api/item/:itemID').get(function(req, res) {

        var id = parseInt(req.params.itemID);

        if (isNaN(id)) {
            res.status(400).send('Invalid ID. Please try again.');
        } else {

            itemCtrl.getItemData(id)
                .then((itemData) => {
                    
                    if (itemData.buys !== undefined) {
                        itemData.buys = convertPrice(itemData.buys);
                        itemData.sells = convertPrice(itemData.sells);
                    }

                    recipeCtrl.getRecipeData(id)
                        .then((recipeData) => {
                            res.json({
                                data: itemData || null,
                                recipes: recipeData || null
                            });
                        });

                })
                .catch(error => {
                    res.status(400)
                        .send(error.serverMessage || 'Something has gone wrong whilst fulfilling your request.');
                });

        }
    });
};

/**
 * Converts the price returned from the commerce API and
 * calculates the Gold/Silver/Bronze ratio for item
 */


function convertPrice(transaction) {
    const coinUtils = require('./../utils/coinUtils.js');

    let itemPrice = {
        quantity: transaction.quantity,
        price: transaction.unit_price // jshint ignore:line
    };

    itemPrice.price = coinUtils.calculatePriceRatio(itemPrice.price);
    return itemPrice;
}