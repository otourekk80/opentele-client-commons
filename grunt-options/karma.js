(function() {
    "use strict";

    module.exports = function(environment) {

        return {
            options: {
                configFile: 'karma.conf.js'
            },
            unit: {
                browsers: ['Chrome_small'],
                singleRun: true
            },
            unitDebug: {
                browsers: ['Chrome_small'],
                singleRun: false,
                autoWatch: false
            },
            ciUnit: {
                browsers: ['PhantomJS'],
                singleRun: true,
                preprocessors: {
                    'app/tmp/questionnaireParser/**/*.js': ['coverage'],
                    'app/tmp/deviceListeners/**/*.js': ['coverage']
                },
                reporters: [
                    'progress', 'junit', 'coverage', 'threshold'
                ]
            }
        };
    };

}());
