(function() {
    "use strict";

    // Imports

    var glob = require('glob');
    var fs = require('fs');

    // Helper functions

    var addPathsToEnvironment = function(environment) {

        var appTsFiles = [
            'app/questionnaireParser/**/*.ts',
            'app/deviceListeners/**/*.ts'
        ];
        environment.appTsFiles = appTsFiles;

        var bowerComponentsPath = 'app/bower_components/';

        var libFiles = [
            bowerComponentsPath + 'angular/angular.js'
        ];
        environment.libFiles = libFiles;

        var allScriptFiles = [
            'Gruntfile.js',
            'grunt-options/*.js',
            'karma.conf.js',
            'typings/tsd.d.ts',
            'unit-tests/**/*.js'
        ].concat(environment.appTsFiles);
        environment.allScriptFiles = allScriptFiles;

        var htmlFiles = [
            'app/questionnaireParser/nodeTemplates/*.html',
            'app/deviceListeners/measurementTemplates/*.html'
        ];
        environment.htmlFiles = htmlFiles;

        var appTempFiles = [
            'app/tmp/**/*.js'
        ];
        environment.appTempFiles = appTempFiles;

    };

    var createEnvironment = function(grunt) {
        var environment = {};
        environment.grunt = grunt;
        addPathsToEnvironment(environment);
        return environment;
    };

    var loadConfig = function(optionPath, environment) {

        var options = {};
        var key;

        glob.sync('*', {cwd: optionPath}).forEach(function(option) {
            console.log("Requiring: " + option);
            key = option.replace(/\.js$/,'');
            var optionConstructor = require(optionPath + option);
            options[key] = optionConstructor(environment);
        });

        return options;
    };

    var registerTasks = function(grunt) {

        var cleaningTasks = [
            'clean:default',
            'bower'
        ];

        var typeScriptTasks = [
            'tslint',
            'ts'
        ];

        var html2JsTasks = [
            'html2js:deviceListeners',
            'html2js:questionnaireParser'
        ];

        var devConfig = cleaningTasks
            .concat([
                'watch'
            ]);
        grunt.registerTask('dev', devConfig);
        
        var debugConfig = cleaningTasks
            .concat([
                'newer:tslint',
                'ts',
                'newer:html2js:deviceListeners',
                'newer:html2js:questionnaireParser',
                'karma:unitDebug'
            ]);
        grunt.registerTask('dev-debug', debugConfig);
        
        var testConfig = cleaningTasks
            .concat(typeScriptTasks)
            .concat(html2JsTasks)
            .concat(['karma:ciUnit']);
        grunt.registerTask('ci-unittest', testConfig);

        var releaseConfig = cleaningTasks
            .concat([
                'tslint',
                'ts:dist'])
            .concat(html2JsTasks)
            .concat([
                'concat:dist',
                'ngAnnotate:opentele',
                'uglify:dist'
            ]);
        grunt.registerTask('release', releaseConfig);

    };

    // Exports

    var configureProject = function(grunt) {
        var environment = createEnvironment(grunt);
        var properties = grunt.file.readJSON('package.json');

        var config = {
            pkg: properties,
            packageName: properties.name
        };

        grunt.util._.extend(config, loadConfig('./grunt-options/', environment));

        grunt.initConfig(config);

        // Time tasks
        require('time-grunt')(grunt);

        // Load tasks (JIT)
        var staticMapping = {
            bower: 'grunt-bower-task'
        };

        require('jit-grunt')(grunt, staticMapping);

        // Register tasks
        registerTasks(grunt);
    };

    module.exports = configureProject;

}());
