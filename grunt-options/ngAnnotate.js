(function() {
    "use strict";

    module.exports = function(environment) {

        return {
            options: {
                add: true
            },
            opentele: {
                files: {
                    'dist/deviceListeners.js': ['dist/deviceListeners.js'],
                    'dist/questionnaireParser.js': ['dist/questionnaireParser.js']
                }
            }
        };
    };

}());
