(function() {
    'use strict';

    let assignmentNodeParser = angular.module(
        'opentele-commons.questionnaireParser.assignmentNodeParser', []);

    assignmentNodeParser.service('assignmentNodeParser', (nodesParser) => {

        let parseAssignmentNode = (node, nodeMap, outputModel) => {
            let variableName = node.variable.name;
            outputModel[variableName] = {
                name: variableName,
                value: node.expression.value,
                type: node.variable.type
            };

            let nextNodeId = node.next;
            return nodesParser.parse(nextNodeId, nodeMap, outputModel);
        };

        return parseAssignmentNode;
    });

}());
