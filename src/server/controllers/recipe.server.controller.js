// src/server/controllers/recipe.server.controller
/* jshint -W106 */

'use strict';

const async = require('async');
const apiUtils = require('./../utils/apiUtils.js');
const itemCtrl = require('./items.server.controller.js');
const db = require('./../db/index.js');
const coinUtil = require('./../utils/coinUtils.js');
let recipeObject = [];

/**
 * Essentially builds the recipe object that is then pushed back 
 * to the client
 */
function getRecipeData(id) {

    return new Promise((resolve, reject) => {

        getRecipeOutputs(id)
            .then(outputIDs => {
                if (outputIDs) {
                    return recipeAPIData(outputIDs)
                        .then(recipes => {
                            return db.addRecipes(id, recipes);
                        })
                        .then(recipeApiResult => {
                            recipeObject = recipeApiResult;
                            return getIngredientItemData(recipeObject);
                        });
                } else {
                    return null;
                }
            })
            .then(result => {
                resolve(result);
            })
            .catch((error) => {
                if (error.serverMessage) {
                    reject(null);
                } else {
                    reject(error);
                }
            });
    });
}

/**
 * Uses the item id that is passed through to 
 * search for the recipes that craft the item.
 */
function getRecipeOutputs(id) {

    return new Promise((resolve, reject) => {
        apiUtils.gw2APIData('recipes/search?output=', id)
            .then((returnIDs) => {
                if (returnIDs.length === 0) {
                    resolve(null);
                } else {
                    resolve(returnIDs);
                }
            })
            .catch((error) => reject(error));

    });
}

/**
 * Returns information about recipes using their respective IDs
 */
function recipeAPIData(ids) {
    return new Promise((resolve, reject) => {
        async.concat(ids, function recipeAPIData(id, callback) {
            apiUtils.gw2APIData('recipes/', id)
                .then((recipe) => {
                    delete recipe.output_item_id;
                    callback(null, recipe);
                })
                .catch((error) => {
                    reject(error);
                });
        }, (err, recipeData) => {
            if (err) {
                reject(err);
            } else {
                resolve(recipeData);
            }
        });
    });
}

/**
 *  Retrives the relative item and commerce data for each item ID that is passed.
 */
function getIngredientItemData(recipes) {

    return new Promise((resolve, reject) => {

        async.each(recipes, function(r, callback) {

            r.recipeTotal = 0;

            async.forEachOf(r.ingredients, function(i, index, callbk) {

                itemCtrl.getItemData(i.item_id)
                    .then(itemData => {

                        if (itemData.hasOwnProperty('commerce')) {
                            let total = (i.count * itemData.commerce.buys.nonConvertedPrice);
                            r.recipeTotal = r.recipeTotal + total;
                            itemData.ingredientTotal = coinUtil.calculatePriceRatio(total);
                        }

                        Object.assign(r.ingredients[index], itemData);
                        delete r.ingredients[index]._id;
                        callbk();
                    })
                    .catch(function(error) {
                        callbk(error);
                    });

            }, function(err) {
                if (err) {
                    reject(err);
                } else {
                    r.recipeTotal = coinUtil.calculatePriceRatio(r.recipeTotal);
                    callback();
                }
            });

        }, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(recipes);
            }
        });
    });
}


exports.getRecipeData = getRecipeData;
exports.getIngredientItemData = getIngredientItemData;