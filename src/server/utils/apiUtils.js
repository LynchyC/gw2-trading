// src/server/utils/apiUtils.js

'use strict';

var request = require('request');

/**
 * Goes off to the GW2 API (depending on whats appended at the end of the url) 
 * and retrieves the relevant item/commerce data.
 */

function gw2APIData(apiSearch, id, next) {

    request(`https://api.guildwars2.com/v2/${apiSearch}/${id}`, function(err, response, body) {

        if (err) {
            next(err);
        } else if (JSON.parse(body).text == 'no such id') {

            var errObject;

            switch (apiSearch) {
                case 'items/':
                    errObject = {
                        title: 'Error has Occured',
                        serverMessage: 'Item ID does not exist. Please check and try again.'
                    };
                    break;
                case 'commerce/prices/':
                    errObject = null;
                    break;
                default:
                    errObject = {
                        title: 'What?',
                        serverMessage: 'Something weird has happened. Time to flee.'
                    };
                    break;
            }

            next(errObject, null);

        } else if (!err && response.statusCode == 200) {

            next(null, JSON.parse(body));

        }
    });
}

exports.gw2APIData = gw2APIData;