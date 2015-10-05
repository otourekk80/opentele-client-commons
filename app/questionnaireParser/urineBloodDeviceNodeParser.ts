import {
    Representation, NodeModel, LeftButton, RightButton
} from 'parserTypes';

(function() {
    'use strict';

    let bloodUrineDeviceNodeParser = angular.module('opentele-commons.questionnaireParser.bloodUrineDeviceNodeParser', []);

    let service = ($templateCache, parserUtils) => {

        let parseNode = (node) => {

            let nodeModel : NodeModel = {
                heading: node.text,
                measurementSelections: [
                    'URINE_LEVEL_NEGATIVE', 'URINE_LEVEL_PLUS_MINUS',
                    'URINE_LEVEL_PLUS_ONE', 'URINE_LEVEL_PLUS_TWO',
                    'URINE_LEVEL_PLUS_THREE'
                ]
            };

            let leftButton : LeftButton = {
                text: "Omit",
                nextNodeId: node.nextFail
            };

            let rightButton : RightButton = {
                text: "Next",
                nextNodeId: node.next,
                clickAction: (scope) => {
                    var nodeName = node.bloodUrine.name;
                    var radix = 10;
                    scope.outputModel[nodeName] = {
                        name: nodeName,
                        type: node.bloodUrine.type,
                        value: parseInt(scope.nodeModel.measurement, radix)
                    };
                },
                validate: (scope) => scope.inputForm.$dirty
            };

            let representation : Representation = {
                nodeTemplate: parserUtils.getNodeTemplate('urineLevel.html'),
                nodeModel: nodeModel,
                leftButton: leftButton,
                rightButton: rightButton
            };

            return representation;
        };

        return parseNode;
    };

    bloodUrineDeviceNodeParser.service('bloodUrineDeviceNodeParser', service);

}());
