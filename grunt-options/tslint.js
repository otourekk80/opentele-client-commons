(function() {
    "use strict";

    module.exports = function(environment) {

        return {
            options: {
                configuration: environment.grunt.file.readJSON("tslint.json")
            },
            default: {
                src: environment.appTsFiles
            }
        };
    };

}());
