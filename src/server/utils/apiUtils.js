// src/server/utils/apiUtils.js

'use strict';

const axios = require('axios');

/**
 * Goes off to the GW2 API (depending on whats appended at the end of the url) 
 * and retrieves the relevant item/commerce data.
 */

function gw2APIData(apiSearch, id) {

    return new Promise((resolve, reject) => {
        axios.get(`https://api.guildwars2.com/v2/${apiSearch}${id}`)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {

                if (error.data.text === 'no such id') {
                    let apiObject = null;

                    switch (apiSearch) {
                        case 'items/':
                            apiObject = {
                                title: 'Error has Occured',
                                serverMessage: 'Item ID does not exist. Please check and try again.'
                            };
                            reject(apiObject);
                            break;
                        case 'commerce/prices/':
                            apiObject = null;
                            resolve(apiObject);
                            break;
                        default:
                            apiObject = {
                                title: 'What?',
                                serverMessage: 'Something weird has happened. Time to flee.'
                            };
                            reject(apiObject);
                            break;
                    }
                } else {
                    reject(new Error('Error has occured when retrieving API data: ' + error.status));
                }
            });
    });
}

exports.gw2APIData = gw2APIData;