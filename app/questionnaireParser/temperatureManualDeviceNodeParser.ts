import { Representation, NodeModel, LeftButton, RightButton } from 'parserTypes';

(function() {
    'use strict';
                                                      
    let temperatureDeviceNodeParser = angular.module('opentele-commons.questionnaireParser.temperatureManualDeviceNodeParser', []);

    let temperatureService = ($templateCache, parserUtils) => {

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
                validate: (scope) => scope.temperatureForm.temperature.$valid,
                clickAction: (scope) => {
                    let nodeName = node.temperature.name;
                    scope.outputModel[nodeName] = {
                        name: nodeName,
                        type: node.temperature.type,
                        value: scope.nodeModel.temperatureMeasurement
                    };
                }
            };

            let representation : Representation = {
                nodeTemplate: parserUtils.getNodeTemplate('temperatureManualDeviceNode.html'),
                nodeModel: nodeModel,
                leftButton: leftButton,
                rightButton: rightButton
            };

            return representation;
        };

        return parseNode;
    };

    temperatureDeviceNodeParser.service('temperatureManualDeviceNodeParser', temperatureService);

}());