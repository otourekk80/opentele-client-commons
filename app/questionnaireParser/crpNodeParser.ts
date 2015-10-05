import { Representation, NodeModel, LeftButton, RightButton } from 'parserTypes';

(function() {
    'use strict';

    let crpNodeParser = angular.module('opentele-commons.questionnaireParser.crpNodeParser', []);

    crpNodeParser.service('crpNodeParser', ($templateCache, parserUtils) => {

        let parseNode = (node) => {

            let nodeModel : NodeModel = {
                    heading: node.text
            };

            let leftButton = {
                text: "Omit",
                nextNodeId: node.nextFail
            };

            let rightButton = {
                text: "Next",
                nextNodeId: node.next,
                validate: (scope) => {
                    let isLt5CheckedAndNothingElse = () =>
                        (scope.nodeModel.crpLt5Measurement === true) &&
                        ((scope.nodeModel.crpCountMeasurement === undefined) ||
                         (scope.nodeModel.crpCountMeasurement === null) ||
                         (scope.nodeModel.crpCountMeasurement.length === 0));
                    let isValueEnteredAndNothingElse = () =>
                        (scope.nodeModel.crpLt5Measurement !== true) &&
                        (scope.nodeModel.crpCountMeasurement !== undefined) &&
                        (scope.nodeModel.crpCountMeasurement !== null) &&
                        (0 <= scope.nodeModel.crpCountMeasurement) &&
                        (0 < scope.nodeModel.crpCountMeasurement.toString().length);
                    return isLt5CheckedAndNothingElse() ||
                        isValueEnteredAndNothingElse();
                },
                clickAction: (scope) => {
                    let nodeName = node.CRP.name;
                    let lt5 = scope.nodeModel.crpLt5Measurement;
                    let count = scope.nodeModel.crpCountMeasurement;
                    scope.outputModel[nodeName] = {
                        name: nodeName,
                        type: node.CRP.type,
                        value: (lt5 || count < 5) ? 0 : count
                    };
                }
            };

            let representation : Representation = {
                nodeTemplate: parserUtils.getNodeTemplate('crpNode.html'),
                nodeModel: nodeModel,
                leftButton: leftButton,
                rightButton: rightButton
            };

            return representation;
        };
        return parseNode = parseNode;

    });
}());
