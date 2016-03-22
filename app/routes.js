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
    app.route('/api/item')
        .get(itemCtrl.getItemData);
};