// src/routes/index.js

'use strict';

const itemCtrl = require('./../controllers/items.server.controller.js');
const recipeCtrl = require('./../controllers/recipe.server.controller.js');

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.render('index', {
            title: 'GW2 Calculator',
        });
    });

    /**
     * Get item info from GW2 API
     */
    app.get('/item', function(req, res) {

        var id = parseInt(req.query.itemID);

        if (validateID(id)) {
            res.status(400);
            res.render('index', {
                title: 'Error has Occured',
                itemMessage: 'Invalid ID. Please try again.'
            });

        } else {
            itemCtrl.getItemData(id, function(err, results) {
                if (err) {
                    res.render('index', {
                        title: err.title || 'Error has Occured',
                        serverMessage: err.serverMessage || 'Something has gone wrong whilst fulfilling your request.',
                    });
                } else {

                    if (results.buys !== undefined) {
                        results.buys = convertPrice(results.buys);
                        results.sells = convertPrice(results.sells);
                    }

                    recipeCtrl.getRecipeData(id, function(err, recipeResults) {
                        if (err) {
                            console.log('Coming from routes index file: ' + err);
                        } else {
                            res.render('index', {
                                title: 'Your Searched Items',
                                data: results,
                                recipes: recipeResults[0]
                            });
                        }
                    });
                }
            });
        }
    });

    function validateID(_id) {
        return isNaN(_id);
    }
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

    itemPrice.price = coinUtils.calucatePriceRatio(itemPrice.price);
    return itemPrice;
}