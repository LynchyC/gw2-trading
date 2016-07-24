module.exports = function() {
    var client = './src/client/';
    var server = './src/server/';
    var config = {

        /**
         * File Paths
         */

        // all the .js files that need to be vetted
        alljs: [
            './src/server/**/*.js',
            './*.js'
        ],
        client: client,
        css: client + 'styles/stylesheet.css',
        index: server + 'views/layout.vash',
        views: server + 'views/',

        /**
         * Bower and NPM locations
         */
        bower: {
            json: require('./bower.json'),
            directory: client + 'lib/',
            ignorePath: '/client'
        },

        /**
         * Node Settings
         */
        defaultPort: 1337,
        nodeServer: server + 'app.js'

    };

    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };

        return options;
    };

    return config;
};