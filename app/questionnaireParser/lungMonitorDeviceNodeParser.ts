import { NodeModel, Representation, LeftButton, RightButton, Html5Hook } from 'parserTypes';

(function() {
    'use strict';

    let lungMonitorDeviceNodeParser = angular.module(
        'opentele-commons.questionnaireParser.lungMonitorDeviceNodeParser', [
            'opentele-commons.deviceListeners'
        ]);

    let lungMonitorDeviceNodeParserService = ($templateCache, parserUtils, nativeService, lungFunctionListener) => {

        const OMIT = 'Omit';
        const NEXT = 'Next';
        const LUNG_FUNCTION = 'lung function';

        let nodeTemplate = parserUtils.getNodeTemplate('lungMonitorDeviceNode.html');

        let validate = (scope) => {
            let isValueEntered = () =>
                (scope.nodeModel.fev1 !== undefined) &&
                (scope.nodeModel.fev6 !== undefined) &&
                (scope.nodeModel.fev1Fev6Ratio !== undefined) &&
                (scope.nodeModel.goodTest !== undefined) &&
                (scope.nodeModel.softwareVersion !== undefined);
            return isValueEntered();
        };

        let generateRepresentation = (node, nodeModel : NodeModel) => {

            let clickAction = (scope) => {

                let measurements = [
                    'fev1', 'fev6', 'fev1Fev6Ratio', 'fef2575',
                    'goodTest', 'softwareVersion', 'deviceId'
                ];

                measurements.forEach((measurement) => {
                    var measurementName = node[measurement].name;
                    var measurementType = node[measurement].type;
                    var measurementValue = scope.nodeModel[measurement];

                    scope.outputModel[measurementName] = {
                        name: measurementName,
                        type: measurementType,
                        value: measurementValue
                    };
                });
            };

            var leftButton : LeftButton = {
                text: OMIT,
                nextNodeId: node.nextFail
            };

            var rightButton : RightButton = {
                text: NEXT,
                nextNodeId: node.next,
                validate: validate,
                clickAction: clickAction
            };

            var representation : Representation = {
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
                heading: node.text,
                info: 'CONNECTING'
            };

            let eventListener : Function = lungFunctionListener.create(nodeModel);
            nodeModel.eventListener = eventListener;
            nativeService.addDeviceListener(LUNG_FUNCTION, html5HookDescription);

            let representation : Representation = generateRepresentation(node, nodeModel);
            return representation;
        };

        return parseNode;
    };

    lungMonitorDeviceNodeParser.service('lungMonitorDeviceNodeParser',
                                        lungMonitorDeviceNodeParserService);
}());
