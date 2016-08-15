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

    app.route('/api/item/:item').get(function(req, res) {

        if (isNaN(req.params.item)) {

            let searchText = req.params.item;
            const db = require('./../db/index.js');
            db.getItemByName(searchText)
                .then(dbResult => {
                    res.json({
                        data: dbResult || null
                    });
                })
                .catch(error => {
                    res.status(400)
                        .send(error.serverMessage || 'Something has gone wrong whilst fulfilling your request.');
                });
        } else {

            var id = parseInt(req.params.item);

            itemCtrl.getItemData(id)
                .then(itemData => {

                    if (itemData && itemData.recipes) {
                        recipeCtrl.getIngredientItemData(itemData.recipes).then(result => {
                            res.json({
                                data: itemData || null,
                                recipes: result || null
                            });
                        });

                    } else {
                        recipeCtrl.getRecipeData(id)
                            .then(recipeData => {
                                res.json({
                                    data: itemData || null,
                                    recipes: recipeData || null
                                });
                            });
                    }

                })
                .catch(error => {
                    res.status(400)
                        .send(error.serverMessage || 'Something has gone wrong whilst fulfilling your request.');
                });
        }
    });
};