(function() {
    "use strict";

    module.exports = function(environment) {

        return {
            options: {
                separator: '\n'
            },
            dist: {
                files: {
                    'dist/deviceListeners.js': 'app/tmp/deviceListeners/**/*.js',
                    'dist/questionnaireParser.js': 'app/tmp/questionnaireParser/**/*.js'
                }
            }
        };
    };

}());
