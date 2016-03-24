// .app/controllers/items.server.controller

'use strict';

var request = require('request');

exports.getItemData = (req, res) => {
    let id = parseInt(req.query.itemID);

    if (isNaN(id)) {
        res.render('index', {
            layout: false,
            title: "Error has occured",
            error: "Invalid ID. Please try again."
        });
    } else {

        let itemData = {
            name: '',
            img: '',
            buys: {
                quantity: null,
                price: null
            },
            sells: {
                quantity: null,
                price: null
            }
        };

        request(`https://api.guildwars2.com/v2/items/${id}`, (err, response, body) => {

            var resBody = JSON.parse(body);

            if (err) {
                res.render('index', {
                    layout: false,
                    title: "Error has Occured",
                    error: err
                });
            } else if (resBody.text == 'no such id') {
                res.render('index', {
                    layout: false,
                    title: "Error has occured",
                    error: "ID does not exist. Please check your ID."
                });

            } else if (!err && response.statusCode == 200) {

                itemData = Object.assign(itemData, {
                    name: resBody.name,
                    img: resBody.icon
                });

                exports.getPriceData(res, id, itemData);
            }
        });
    }


};

exports.getPriceData = (res, id, itemData) => {
    request(`https://api.guildwars2.com/v2/commerce/prices/${id}`, (err, response, body) => {

        var resPrice = JSON.parse(body);

        if (err) {
            res.render('index', {
                layout: false,
                title: "Error has Occured",
                error: err
            });
        } else if (resPrice.text == 'no such id') {
            res.render('index', {
                layout: false,
                title: "Your Item",
                data: itemData,
                message: "Current ID has no commerce data"
            });
        } else if (!err && response.statusCode == 200) {

            itemData = Object.assign(itemData, {
                buys: {
                    quantity: resPrice.buys.quantity,
                    price: resPrice.buys.unit_price
                },
                sells: {
                    quantity: resPrice.sells.quantity,
                    price: resPrice.sells.unit_price
                }
            });

            res.render('index', {
                layout: false,
                title: "Your Searched Items",
                data: itemData
            });
        } 
    });
};