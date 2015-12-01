(function() {
    "use strict";

    module.exports = function(environment) {
        
        var files = {};
        environment.appAreas.forEach(function(area) {
            var fileName = 'dist/' + area +'.js'; 
            files[fileName] = [fileName];
        });

        return {
            options: {
                add: true
            },
            opentele: {
                files: files
            }
        };
    };

}());
