(function() {
    "use strict";

    module.exports = function(environment) {

        return {
            default: {
                src: ['dist', 'app/tmp']
            },
            tmp: {
                src: ['app/tmp']
            },
            dist: {
                src: ['dist']
            }
        };
    };

}());
