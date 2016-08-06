'use strict';

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/gw2Calc';
let db = null;

function getDB() {

    return new Promise((resolve, reject) => {
        MongoClient.connect(url, (err, database) => {
            if (err) {
                reject('Error connecting to database');
            } else {
                db = {
                    db: database,
                    items: database.collection('items')
                };

                resolve(db);
            }
        });
    });
}

exports.getDB = getDB;