(function() {
    "use strict";

    module.exports = function(environment) {
        
        var files = {};
        environment.appAreas.forEach(function(area) {
            files['dist/' + area + '.min.js'] = ['dist/' + area + '.js'];
        });
        
        return {
            dist: {
                files: files,
                options: {
                    mangle: false,
                    sourceMap: true
                }
            }
        };
    };

}());
