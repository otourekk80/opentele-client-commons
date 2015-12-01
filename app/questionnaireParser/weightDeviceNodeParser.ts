import { NodeModel, Representation, LeftButton, RightButton } from 'parserTypes';

(function() {
    'use strict';

    let weightDeviceNodeParser = angular.module(
        'opentele-commons.questionnaireParser.weightDeviceNodeParser', [
            'opentele-commons.deviceListeners'
        ]);

    let weightDeviceNodeParserService = ($templateCache, parserUtils, nativeService, weightListener) => {

        const OMIT = 'Omit';
        const NEXT = 'Next';
        const WEIGHT = 'weight';

        let generateRepresentation = (node, nodeModel : NodeModel) => {

            let nodeTemplate = parserUtils.getNodeTemplate('weightDeviceNode.html');

            let leftButton : LeftButton = {
                text: OMIT,
                nextNodeId: node.nextFail
            };

            let rightButton : RightButton = {
                text: NEXT,
                nextNodeId: node.next,
                validate: (scope) => {
                    let isValueEntered = () => scope.nodeModel.weight !== undefined;
                    return isValueEntered();
                },
                clickAction: (scope) => {

                    let weightName = node.weight.name;
                    let weightType = node.weight.type;
                    let weightValue = scope.nodeModel.weight;
                    scope.outputModel[weightName] = {
                        name: weightName,
                        type: weightType,
                        value: weightValue
                    };

                    let deviceName = node.deviceId.name;
                    let deviceType = node.deviceId.type;
                    let deviceId = scope.nodeModel.deviceId;
                    scope.outputModel[deviceName] = {
                        name: deviceName,
                        type: deviceType,
                        value: deviceId
                    };
                }
            };

            let representation : Representation = {
                nodeTemplate: nodeTemplate,
                nodeModel: nodeModel,
                leftButton: leftButton,
                rightButton: rightButton
            };

            return representation;
        };

        let parseNode = (node, nodeMap, outputModel) => {

            let nodeModel : NodeModel = {
                heading: "WEIGHT",
                info: node.text
            };

            let eventListener : Function = weightListener.create(nodeModel);
            let nativeEventCallback : Function = (message) => {
                if (message.measurementType !== WEIGHT) {
                    return;
                }
                eventListener(message.event);
            };
            nativeService.subscribeToMultipleMessages('deviceMeasurementResponse', nativeEventCallback);
            nativeService.addDeviceListener(WEIGHT);

            let representation : Representation = generateRepresentation(node, nodeModel);
            return representation;
        };

        return parseNode;
    };

    weightDeviceNodeParser.service('weightDeviceNodeParser', weightDeviceNodeParserService);

}());
