import { NodeModel, Representation, LeftButton, RightButton, Html5Hook } from 'parserTypes';

(function() {
    'use strict';

    let temperatureDeviceNodeParser = angular.module(
        'opentele-commons.questionnaireParser.temperatureDeviceNodeParser', [
            'opentele-commons.deviceListeners'
        ]);

    let temperatureDeviceNodeParserService = ($templateCache, parserUtils, nativeService, temperatureListener) => {

        const OMIT = 'Omit';
        const NEXT = 'Next';
        const TEMPERATURE = 'temperature';

        let generateRepresentation = (node, nodeModel : NodeModel) => {

            let nodeTemplate = parserUtils.getNodeTemplate('temperatureDeviceNode.html');

            let leftButton : LeftButton = {
                text: OMIT,
                nextNodeId: node.nextFail
            };

            let rightButton : RightButton = {
                text: NEXT,
                nextNodeId: node.next,
                validate: (scope) => {
                    let isValueEntered = () => scope.nodeModel.temperature !== undefined;
                    return isValueEntered();
                },
                clickAction: (scope) => {

                    let temperatureName = node.temperature.name;
                    let temperatureType = node.temperature.type;
                    let temperatureValue = scope.nodeModel.temperature;
                    scope.outputModel[temperatureName] = {
                        name: temperatureName,
                        type: temperatureType,
                        value: temperatureValue
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

            let html5HookDescription : Html5Hook = {
                elementId: 'deviceHook',
                modelName: 'nodeModel',
                callbackName: 'eventListener'
            };

            let nodeModel : NodeModel = {
                heading: "TEMPERATURE",
                info: node.text
            };

            let eventListener : Function = temperatureListener.create(nodeModel);
            nodeModel.eventListener = eventListener;
            nativeService.addDeviceListener(TEMPERATURE, html5HookDescription);

            let representation : Representation = generateRepresentation(node, nodeModel);
            return representation;
        };

        return parseNode;
    };
    temperatureDeviceNodeParser.service('temperatureDeviceNodeParser', temperatureDeviceNodeParserService);

}());
