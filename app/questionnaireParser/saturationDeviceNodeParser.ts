import { NodeModel, Representation, LeftButton, RightButton } from 'parserTypes';

(function() {
    'use strict';

    let saturationDeviceNodeParser = angular.module(
        'opentele-commons.questionnaireParser.saturationDeviceNodeParser', [
            'opentele-commons.deviceListeners'
        ]);

    let saturationDeviceNodeParserService = ($templateCache, parserUtils, nativeService, saturationListener) => {

        const OMIT = 'Omit';
        const NEXT = 'Next';
        const SATURATION = 'saturation';

        let generateRepresentation = (node, nodeModel) => {

            let nodeTemplate = parserUtils.getNodeTemplate('saturationDeviceNode.html');

            let leftButton : LeftButton = {
                text: OMIT,
                nextNodeId: node.nextFail
            };

            let rightButton : RightButton = {
                text: NEXT,
                nextNodeId: node.next,
                validate: (scope) => {
                    let isValueEntered = () =>
                        (scope.nodeModel.saturation !== undefined) &&
                        (scope.nodeModel.pulse !== undefined);
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

                    let pulseName = node.pulse.name;
                    let pulseType = node.pulse.type;
                    let pulseValue = scope.nodeModel.pulse;
                    scope.outputModel[pulseName] = {
                        name: pulseName,
                        type: pulseType,
                        value: pulseValue
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

            let eventListener : Function = saturationListener.create(nodeModel, false);
            let nativeEventCallback : Function = (message) => {
                if (message.measurementType !== SATURATION) {
                    return;
                }
                eventListener(message.event);
            };
            nativeService.subscribeToMultipleMessages('deviceMeasurementResponse', nativeEventCallback);
            nativeService.addDeviceListener(SATURATION);

            let representation = generateRepresentation(node, nodeModel);
            return representation;
        };

        return parseNode;
    };
    saturationDeviceNodeParser.service('saturationDeviceNodeParser',
                                       saturationDeviceNodeParserService);

}());
