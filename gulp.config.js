module.exports= function () {
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
        ]
    };

    return config;
};