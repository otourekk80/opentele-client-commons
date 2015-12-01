(function() {
    "use strict";

    module.exports = function(environment) {
        
        var files = {}; 
        environment.appAreas.forEach(function(area) {
            var key = 'dist/' + area + '.js';
            var value = 'app/tmp/' + area + '/**/*.js';
            files[key] = value;
        });

        return {
            options: {
                separator: '\n'
            },
            dist: {
                files: files
            }
        };
    };

}());
