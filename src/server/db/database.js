const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/gw2Calc';
let db = null;

function getDB(next) {
    if (!db) {
        // connect to the database
        MongoClient.connect(url, (err, database) => {
            if (err) {
                next('Error connecting to database', null);
            } else {
                db = {
                    db: database,
                    items: db.collection('items')
                };

                next(null, db);
            }
        });
    } else {
        next(null, db);
    }
}

exports.getDB = getDB;