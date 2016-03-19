// app/routes.js

'use strict';

module.exports = function(app) {

    app.get('/', (req, res) => {
        res.render("index", {   
           title: "GW2 Calculator",
           text: "Hello World!" 
        });
    });

};