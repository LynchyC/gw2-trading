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
        let id = parseInt(req.query.itemID);

        if (validateID(id)) {
            res.status(400);
            res.render('index', {
                title: "Error has Occured",
                itemMessage: "Invalid ID. Please try again."
            });

        } else {
            itemCtrl.getItemData(id, function(err, results) {
                if (err) {
                    res.render('index', {
                        title: err.title || 'Error has Occured' ,
                        itemMessage: err.itemMessage,
                        commerceMessage: err.commerceMessage,
                        data: null || results
                    });
                } else {
                    res.render('index', {
                        title: 'Your Searched Items',
                        data: results
                    });
                }
            });
        }
    });

    /**
     * Make sure that the ID is actually a number. Trust me ... I have tried passing text before.
     */
    function validateID(id) {
        return isNaN(id);
    }
};