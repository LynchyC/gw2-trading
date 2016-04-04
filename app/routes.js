// app/routes.js

'use strict';

var itemCtrl = require('./controllers/items.server.controller');

module.exports = function(app) {

    app.get('/', (req, res) => {
        res.render('index', {
            title: "GW2 Calculator",
        });
    });

    /**
     * Get item info from GW2 API
     */
    app.get('/item', (req, res) => {
        let id = req.query.itemID;
        itemCtrl.getItemData(id, function(err, results) {
            if (err) {
                res.status(400);
                res.render('index', {
                    error: true,
                    title: err.title,
                    message: err.message
                });
            } else if (results.buys.quantity == null) {
                res.render('index', {
                    error: false,
                    title: "Your Searched Items",
                    message: "No commerce data available for this ID",
                    data: results
                });
            } else {
                res.render('index', {
                    title: 'Your Searched Items',
                    data: results
                });
            }
        });
    });
};