(function() {
    "use strict";

    module.exports = function(environment) {

        return {
            options: {
                base: 'app'
            },
            deviceListeners: {
                src: 'app/deviceListeners/measurementTemplates/*.html',
                dest: 'app/tmp/deviceListeners/templates.js',
                options: {
                    module: 'opentele-commons.deviceListeners.templates'
                }
            },
            questionnaireParser: {
                src: 'app/questionnaireParser/nodeTemplates/*.html',
                dest: 'app/tmp/questionnaireParser/templates.js',
                options: {
                    module: 'opentele-commons.questionnaireParser.templates'
                }
            }
        };
    };

}());
