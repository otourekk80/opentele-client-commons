import { Representation, NodeModel, LeftButton, RightButton } from 'parserTypes';

(function() {
    'use strict';

    let urineDeviceNodeParser = angular.module('opentele-commons.questionnaireParser.urineDeviceNodeParser', []);

    urineDeviceNodeParser.service('urineDeviceNodeParser', ($templateCache, parserUtils) => {

        let parseNode = (node) => {

            let nodeModel : NodeModel = {
                    heading: node.text,
                    measurementSelections: [
                        'URINE_LEVEL_NEGATIVE', 'URINE_LEVEL_PLUS_MINUS',
                        'URINE_LEVEL_PLUS_ONE', 'URINE_LEVEL_PLUS_TWO',
                        'URINE_LEVEL_PLUS_THREE', 'URINE_LEVEL_PLUS_FOUR'
                    ]
            };

            let leftButton = {
                text: "Omit",
                nextNodeId: node.nextFail
            };

            let rightButton = {
                text: "Next",
                nextNodeId: node.next,
                clickAction: (scope) => {
                    let nodeName = node.urine.name;
                    let radix = 10;
                    scope.outputModel[nodeName] = {
                        name: nodeName,
                        type: node.urine.type,
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
    });

}());
