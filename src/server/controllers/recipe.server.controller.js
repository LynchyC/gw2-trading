// src/server/controllers/recipe.server.controller
/* jshint -W106 */

'use strict';

const async = require('async');
const apiUtils = require('./../utils/apiUtils.js');
const itemCtrl = require('./items.server.controller.js');
const coinUtil = require('./../utils/coinUtils.js');
let recipeObject = [];

/**
 * Essentially builds the recipe object that is then pushed back 
 * to the client
 */
function getRecipeData(id, next) {

    getRecipeOutputs(id)
        .then((outputIDs) => {
            return recipeAPIData(outputIDs);
        })
        .then((recipeApiResult) => {
            recipeObject = recipeApiResult;
            return getIngredientItemData(recipeObject);
        })
        .then(() => next(null, recipeObject))
        .catch((error) => handleError(error));

    function handleError(error) {
        if (error.serverMessage) {
            next(null);
        } else {
            next(error);
        }

    }
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
                    reject({
                        serverMessage: 'No recipe data avaliable'
                    });
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
                    callback(null, {
                        recipeID: recipe.id,
                        discipline: recipe.disciplines,
                        itemCount: recipe.output_item_count, // jshint ignore:line
                        ingredients: recipe.ingredients
                    });
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
 * Prints to the console anything and everything 
 * that is passed through it
 */
function printResults(result) {
    console.log(JSON.stringify(result, null, 4));
}

/**
 *  Retrives the relative item and commerce data for each item ID that is passed.
 */
function getIngredientItemData(recipes) {

    return new Promise((resolve, reject) => {

        async.each(recipes, function(r, callback) {

            r.recipeTotal = 0;

            async.forEachOf(r.ingredients, function(i, index, callbk) {

                itemCtrl.getItemData(i.item_id, function(error, results) {
                    if (error) {
                        callbk(error);
                    } else {

                        if (results.buys !== undefined) {
                            let total = (i.count * results.buys.unit_price);
                            r.recipeTotal = r.recipeTotal + total;
                            results.ingredientTotal = coinUtil.calculatePriceRatio(total);
                            results.buys.price = coinUtil.calculatePriceRatio(results.buys.unit_price);
                            results.sells.price = coinUtil.calculatePriceRatio(results.sells.unit_price);
                        }

                        Object.assign(r.ingredients[index], results);
                        delete r.ingredients[index]._id;
                        callbk();
                    }
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
                resolve();
            }
        });
    });
}


exports.getRecipeData = getRecipeData;