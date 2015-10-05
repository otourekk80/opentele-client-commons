(function() {
    "use strict";

    module.exports = function(environment) {

        return {
            install: {
                options: {
                    install: true,
                    copy: false,
                    targetDir: 'app/bower_components',
                    cleanTargetDir: false
                }
            }
        };
    };

}());
