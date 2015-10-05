(function() {
    'use strict';

    let haemoglobinDeviceNodeParser = angular.module('opentele-commons.questionnaireParser.haemoglobinDeviceNodeParser', []);

    haemoglobinDeviceNodeParser.service('haemoglobinDeviceNodeParser', (parserUtils) => {

        let parseNode = (node) =>
            parserUtils.parseSimpleInputNode(node, node.haemoglobinValue, 'HAEMOGLOBIN');

        return parseNode;
    });

}());
