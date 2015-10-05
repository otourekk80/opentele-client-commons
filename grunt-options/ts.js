(function() {
    "use strict";

    module.exports = function(environment) {

        var typings = 'typings/**/*.ts';

        return {
            default: {
                src: environment.appTsFiles.concat(typings),
                outDir: 'app/tmp',
                options: {
                    project: '.',
                    failOnTypeErrors: false,
                    target: 'es5',
                    inlineSources: true,
                    inlineSourceMap: true,
                    module: 'CommonJS'
                }
            },
            dist: {
                src: environment.appTsFiles.concat(typings),
                outDir: 'app/tmp',
                options: {
                    project: '.',
                    failOnTypeErrors: false,
                    target: 'es5',
                    module: 'CommonJS'
                }
            }
        };
    };

}());
