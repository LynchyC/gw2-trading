// src/server/utils/coinUtils.js

'use strict';

/**
 * Calculates the Gold/Silver/Bronze ratio for item
 */

function calucatePriceRatio (unitPrice) {

    let gold = parseInt(unitPrice / 10000);
    let silver = 0;

    if (gold > 0) {
        silver = parseInt(unitPrice % 10000);

        if (silver >= 100) {
            silver = parseInt(silver / 100);
        }

    } else {
        silver = parseInt(unitPrice / 100);
    }
        

    let bronze = parseInt(unitPrice % 100);
    let price = [gold, silver, bronze];

    return price;
}

exports.calucatePriceRatio = calucatePriceRatio;