// src/routes/items.js

'use strict';

var express = require('express');
var router = express.Router();

const itemCtrl = require('./../controllers/items.server.controller.js');
const recipeCtrl = require('./../controllers/recipe.server.controller.js');

router.get('/item/:item', function (req, res) {

    if (isNaN(req.params.item)) {

        let searchText = req.params.item;

        if (searchText.length < 3) {
            res.status(400)
                .send(
                    'Search term too short! Please try again.'
                );
        }

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

                    let recipes = itemData.recipes;
                    delete itemData.recipes;

                    recipeCtrl.getIngredientItemData(recipes).then(result => {
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

module.exports = router;