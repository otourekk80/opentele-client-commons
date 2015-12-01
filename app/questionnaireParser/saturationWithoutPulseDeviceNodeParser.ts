import { NodeModel, Representation, LeftButton, RightButton } from 'parserTypes';

(function() {
    'use strict';

    let saturationWithoutPulseDeviceNodeParser = angular.module(
        'opentele-commons.questionnaireParser.saturationWithoutPulseDeviceNodeParser', [
            'opentele-commons.deviceListeners'
        ]);

    let saturationWithoutPulseDeviceNodeParserService = ($templateCache, parserUtils, nativeService, saturationListener) => {

        const OMIT = 'Omit';
        const NEXT = 'Next';
        const SATURATION = "saturation";

        let generateRepresentation = (node, nodeModel) => {

            let nodeTemplate = parserUtils.getNodeTemplate('saturationWithoutPulseDeviceNode.html');

            let leftButton : LeftButton = {
                text: OMIT,
                nextNodeId: node.nextFail
            };

            let rightButton : RightButton = {
                text: NEXT,
                nextNodeId: node.next,
                validate: (scope) => {
                    let isValueEntered = () => (scope.nodeModel.saturation !== undefined);
                    return isValueEntered();
                },
                clickAction: (scope) => {

                    let saturationName = node.saturation.name;
                    let saturationType = node.saturation.type;
                    let saturationValue = scope.nodeModel.saturation;
                    scope.outputModel[saturationName] = {
                        name: saturationName,
                        type: saturationType,
                        value: saturationValue
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
                heading: node.text
            };

            let eventListener : Function = saturationListener.create(nodeModel, true);
            let nativeEventCallback : Function = (message) => {
                if (message.measurementType !== SATURATION) {
                    return;
                }
                eventListener(message.event);
            };
            nativeService.subscribeToMultipleMessages('deviceMeasurementResponse', nativeEventCallback);
            nativeService.addDeviceListener(SATURATION);

            let representation : Representation = generateRepresentation(node, nodeModel);
            return representation;
        };

        return parseNode;

    };
    saturationWithoutPulseDeviceNodeParser.service('saturationWithoutPulseDeviceNodeParser',
                                                   saturationWithoutPulseDeviceNodeParserService);

}());
