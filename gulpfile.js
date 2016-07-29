'use strict';

const gulp = require('gulp');
const args = require('yargs').argv;
const browserSync = require('browser-sync');
const config = require('./gulp.config')();
const $ = require('gulp-load-plugins')({
    lazy: true
});
var port = process.env.PORT || config.defaultPort;

gulp.task('vet', function() {
    log('Analyzing source with JSHint and JSCS');

    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('wiredep', function() {
    log('Wire up the bower css, js and custom js into the layout');
    const options = config.getWiredepDefaultOptions();
    const wiredep = require('wiredep').stream;

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js), {
            ignorePath: 'src/client'
        }))
        .pipe(gulp.dest(config.views));
});

gulp.task('inject', ['wiredep'], function() {
    log('Wire up the app css into the layout and call wiredep');

    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.css), {
            ignorePath: 'src/client'
        }))
        .pipe(gulp.dest(config.views));
});

gulp.task('serve-dev', ['inject'], function() {
    let isDev = true;

    let nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.server]
    };

    return $.nodemon(nodeOptions)
        .on('restart', ['vet'], function(ev) {
            log('*** nodemon restarted');
            log('File changed on restart: \n' + ev);
            setTimeout(function(){
                browserSync.notify('reloading now ...');
                browserSync.reload({
                    stream: false
                });
            }, config.browserReloadDelay);
        }).on('start', function() {
            log('*** nodemon started');
            startBrowserSync();
        }).on('crash', function() {
            log('*** nodemon crashed: script crashed for some reason');
        }).on('exit', function() {
            log('*** nodemon exited cleanly');
        });
});


/////////////////////////////////////////////////////////

function startBrowserSync() {
    if(args.nosync || browserSync.active) {
        return;
    }

    log('Starting browser-sync on port ' + port);

    let options = {
        proxy: 'localhost:' + port,
        port: 3000,
        files: [
            config.client + '**/*.*'
        ],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadDelay: 0
    };

    browserSync(options);
}


function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}