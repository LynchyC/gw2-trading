'use strict';

const database = require('./database.js');
const ObjectID = require('mongodb').ObjectID;

/**
 * Retrieves an item from the database using ID.
 */

function getItemByID(id) {

    return new Promise((resolve, reject) => {
        database.getDB().then(db => {
            //console.log(`Successfully connected to the db. Looking for id: ${id}`);

            let result = db.items.findOne({
                'itemID': id
            });

            return result;
        }).then(dbResult => {
            resolve(dbResult);
        }).catch(error => {
            console.log(error);
            resolve(null);
        });
    });
}

function getItemByName(searchText) {

    return new Promise((resolve, reject) => {
        database.getDB().then(db => {

            var cursor = db.items.find({
                name: {
                    $regex: new RegExp(searchText),
                    $options: 'i'
                }
            }).toArray();

            return cursor;

        }).then(dbResult => {
            resolve(dbResult);
        }).catch(error => {
            console.log(error);
            resolve(null);
        });
    });
}

function addItem(item) {

    let gw2DB = null;

    return new Promise((resolve, reject) => {
        database.getDB().then(db => {

                gw2DB = db;

                var cursor = db.items.find({
                    'itemID': item.itemID
                }).count();

                return cursor;

            })
            .then(count => {
                if (count > 0) {
                    //console.log(`Function addItem -> ${item.name} already exists in the database. Count: ${count}`);
                    return false;
                } else {
                    item._id = new ObjectID();
                    return gw2DB.items.insertOne(item);
                }
            })
            .then(result => {
                resolve(item);
            })
            .catch(error => {
                console.log(error);
                resolve(null);
            });
    });
}

function addRecipes(id, recipes) {
    return new Promise((resolve, reject) => {

        //console.log(`Adding recipe data for id: ${id}`);

        let gw2DB = null;

        database.getDB().then(db => {

                gw2DB = db;

                let cursor = db.items.find({
                    'itemID': id,
                    'recipes': {
                        $exists: true,
                        $ne: []
                    }
                });

                return cursor;

            }).then(check => {
                if (check) {
                    return gw2DB.items.updateOne({
                        'itemID': id
                    }, {
                        $set: {
                            'recipes': recipes
                        }
                    });
                } else {
                    return false;
                }

            })
            .then(result => {
                if (result) {
                    resolve(recipes);
                } else {
                    resolve(`Recipe data already exists for item ${id}`);
                }
            })
            .catch(error => {
                console.log(error);
                resolve(null);
            });

    });
}

exports.getItemByID = getItemByID;
exports.getItemByName = getItemByName;
exports.addItem = addItem;
exports.addRecipes = addRecipes;