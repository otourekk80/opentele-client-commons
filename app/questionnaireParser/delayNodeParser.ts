import { NodeModel, Representation } from 'parserTypes';

(function() {
    'use strict';

    let delayNodeParser = angular.module('opentele-commons.questionnaireParser.delayNodeParser', []);

    delayNodeParser.service('delayNodeParser', ($interval, parserUtils, nodesParser) => {

        let parseNode = (node, nodeMap) => {

            let onTimerStopped = (scope) => {
                scope.nextNode(node.next, nodesParser, nodeMap);
            };

            let nodeModel : NodeModel = {
                nodeId: node.nodeName,
                heading: node.displayTextString,
                count: (node.countUp === true) ? 0 : node.countTime,
                countTime: node.countTime,
                countUp: node.countUp,
                onTimerStopped: onTimerStopped
            };

            let representation : Representation = {
                nodeTemplate: parserUtils.getNodeTemplate('delayNode.html'),
                nodeModel: nodeModel
            };

            return representation;
        };

        return parseNode;
    });

}());
