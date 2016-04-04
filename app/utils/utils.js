// app/utils/utils.js

'use strict';

var request = require('request');

/**
 * Goes off to the GW2 API (depending on whats appended at the end of the url) 
 * and retrieves the relevant item/commerce data.
 */

exports.gw2APIData = (apiSearch, id, next) => {

    request(`https://api.guildwars2.com/v2/${apiSearch}/${id}`, (err, response, body) => {

        let errObject;

        if (err) {

            switch (apiSearch) {
                case 'items/':
                    errObject = {
                        error: err,
                        title: "Error has Occured",
                        message: 'Something went wrong retrieving the item data. Please try again.'
                    };
                    break;
                case 'commerce/prices/':
                    errObject = {
                        error: err,
                        title: "Your Searched Items",
                        message: "Something went wrong retrieving the items' price data. Please try again"
                    };
                    break;
                default:
                    errObject = {
                        error: err,
                        title: 'You are pretty amazing to end up here.',
                        message: "How did you do this?"
                    };
                    break;
            }

            next(err, null);
        } else if (JSON.parse(body).text == 'no such id') {

            switch (apiSearch) {
                case 'items/':
                    errObject = {
                        title: 'Error has occured',
                        message: 'Item ID does not exist. Please check and try again.'
                    };
                    break;
                case 'commerce/prices/':
                    errObject = true;
                    break;
                default:
                    errObject = {
                        title: 'What?',
                        message: 'Something weird has happened. Time to flee.'
                    };
                    break;
            }

            next(errObject, null);

        } else if (!err && response.statusCode == 200) {

            next(null, JSON.parse(body));

        }
    });
};