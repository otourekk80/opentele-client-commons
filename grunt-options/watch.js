(function() {
    "use strict";

    module.exports = function(environment) {

        return {
            default: {
                files: environment.allScriptFiles
                    .concat(environment.htmlFiles),
                tasks: [
                    'newer:tslint',
                    'ts',
                    'newer:html2js:deviceListeners',
                    'newer:html2js:questionnaireParser',
                    'karma:unit'
                ],
                options: {
                    atBegin: true
                }
            }
        };
    };

}());
