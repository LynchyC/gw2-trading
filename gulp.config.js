module.exports = function() {
    var client = './src/client/';
    var clientApp = client + 'js/';
    var server = './src/server/';
    var config = {

        /**
         * File Paths
         */

        // all the .js files that need to be vetted
        alljs: [
            '.src/client/js/**/*.js',
            './src/server/**/*.js',
            './*.js'
        ],
        client: client,
        css: client + 'styles/stylesheet.css',
        index: server + 'views/layout.html',
        js: [
            clientApp + '**/*.js'
        ],
        views: server + 'views/',

        /**
         * browser sync
         */
        browserReloadDelay: 1000,

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