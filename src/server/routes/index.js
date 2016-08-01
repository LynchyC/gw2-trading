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

        var id = parseInt(req.query.itemID);

        if (isNaN(id)) {
            res.status(400).send('Invalid ID. Please try again.');
        } else {
            itemCtrl.getItemData(id, function(err, results) {
                if (err) {
                    res.status(400)
                        .send(err.serverMessage || 'Something has gone wrong whilst fulfilling your request.');
                } else {

                    if (results.buys !== undefined) {
                        results.buys = convertPrice(results.buys);
                        results.sells = convertPrice(results.sells);
                    }

                    recipeCtrl.getRecipeData(id, function(err, recipeResults) {
                        if (err) {
                            res.status(400)
                                .send(err.serverMessage || 'Something has gone wrong whilst fulfilling your request.');
                        } else {
                            res.json({
                                data: results || null,
                                recipes: recipeResults || null
                            });
                        }
                    });
                }
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