// src/routes/index.js

'use strict';

var itemCtrl = require('./../controllers/items.server.controller.js');

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.render('index', {
            title: "GW2 Calculator",
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
                title: "Error has Occured",
                itemMessage: "Invalid ID. Please try again."
            });

        } else {
            itemCtrl.getItemData(id, function(err, results) {
                if (err) {
                    res.render('index', {
                        title: err.title || 'Error has Occured',
                        serverMessage: err.serverMessage || 'Something has gone wrong whilst fulfilling your request.',
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

    function validateID(_id) {
        return isNaN(_id);
    }
};