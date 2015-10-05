(function() {
    "use strict";

    module.exports = function(environment) {

        return {
            dist: {
                files: {
                    'dist/deviceListeners.min.js': ['dist/deviceListeners.js'],
                    'dist/questionnaireParser.min.js': ['dist/questionnaireParser.js']
                },
                options: {
                    mangle: false,
                    sourceMap: true
                }
            }
        };
    };

}());
