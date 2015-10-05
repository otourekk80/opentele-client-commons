(function() {
    "use strict";

    module.exports = function(config) {

        config.set({

            basePath: './',

            files: [
                'app/bower_components/angular/angular.js',
                'app/bower_components/angular-mocks/angular-mocks.js',
                'app/tmp/**/*.js',
                'unit-tests/**/*.js'
            ],

            customLaunchers: {
                Chrome_small: {
                    base: 'Chrome',
                    flags: ['--window-size=100,100']
                }
            },

            autoWatch: true,

            frameworks: ['jasmine', 'source-map-support'],

            plugins: [
                'karma-phantomjs-launcher',
                'karma-chrome-launcher',
                'karma-firefox-launcher',
                'karma-coverage',
                'karma-jasmine',
                'karma-junit-reporter',
                'karma-source-map-support',
                'karma-threshold-reporter'
            ],

            reporters: [
                'progress',
                'junit'
            ],

            junitReporter: {
                outputFile: 'test_out/unit.xml',
                suite: 'unit'
            },

            coverageReporter: {
                type: 'html',
                dir: 'test_out/'
            },

            thresholdReporter: {
                statements: 80,
                branches: 60,
                functions: 85,
                lines: 80
            }

        });
    };
}());
