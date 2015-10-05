(function() {
    'use strict';

    let endNodeParser = angular.module('opentele-commons.questionnaireParser.endNodeParser', []);

    endNodeParser.service('endNodeParser', () => {

        let parseNode = (node) => {
            return {
                isEndNode: true
            };
        };
        return parseNode;
    });

}());
