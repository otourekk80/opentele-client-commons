(function() {
    "use strict";

    module.exports = function(environment) {

        var preprocessors = {};
        environment.appAreas.forEach(function(area) {
            preprocessors['app/tmp/' + area + '/**/*.js'] = ['coverage'];
        });

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
                preprocessors: preprocessors,
                reporters: [
                    'progress', 'junit', 'coverage', 'threshold'
                ]
            }
        };
    };

}());
