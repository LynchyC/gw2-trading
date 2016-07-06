// src/server/utils/coinUtils.js

'use strict';

/**
 * Calculates the Gold/Silver/Bronze ratio for item
 */

function calucatePriceRatio (unit_price) {

    let gold = parseInt(unit_price / 10000);
    let silver = 0;

    if (gold > 0) {
        silver = parseInt(unit_price % 10000);

        if (silver >= 100) {
            silver = parseInt(silver / 100);
        }

    } else {
        silver = parseInt(unit_price / 100);
    }
        

    let bronze = parseInt(unit_price % 100);
    let price = [gold, silver, bronze];

    return price;
}

exports.calucatePriceRatio = calucatePriceRatio;