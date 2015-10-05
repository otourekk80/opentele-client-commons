import { Representation, NodeModel, LeftButton, RightButton } from 'parserTypes';

(function() {
    'use strict';

    let bloodSugarManualDeviceNodeParser = angular.module(
        'opentele-commons.questionnaireParser.bloodSugarManualDeviceNodeParser', []);

    let bloodSugarService = ($templateCache, parserUtils) => {

        let parseNode = (node) => {

            let nodeModel : NodeModel = {
                    heading: node.text
            };

            let leftButton : LeftButton = {
                text: "Omit",
                nextNodeId: node.nextFail
            };

            let rightButton : RightButton = {
                text: "Next",
                nextNodeId: node.next,
                validate: (scope) => scope.bloodSugarForm.count.$valid,
                clickAction: (scope) => {
                    let nodeName = node.bloodSugarMeasurements.name;
                    let isBeforeMeal = scope.nodeModel.bloodSugarManualBeforeMeal;
                    let isAfterMeal = scope.nodeModel.bloodSugarManualAfterMeal;
                    let timestamp = new Date().toISOString();
                    scope.outputModel[nodeName] = {
                        name: nodeName,
                        type: 'BloodSugarMeasurements',
                        value: {
                            measurements: [{
                                'result': scope.nodeModel.bloodSugarManualMeasurement,
                                'isBeforeMeal': isBeforeMeal,
                                'isAfterMeal': isAfterMeal,
                                'timeOfMeasurement': timestamp
                            }],
                            transferTime: timestamp
                        }
                    };
                }
            };

            let representation : Representation = {
                nodeTemplate: parserUtils.getNodeTemplate('bloodSugarManualDeviceNode.html'),
                nodeModel: nodeModel,
                leftButton: leftButton,
                rightButton: rightButton
            };

            return representation;
        };

        return parseNode;
    };
    bloodSugarManualDeviceNodeParser.service('bloodSugarManualDeviceNodeParser',
                                             bloodSugarService);
}());
