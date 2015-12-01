import { NodeModel, Representation, LeftButton, RightButton } from 'parserTypes';

(function() {
    'use strict';

    let bloodPressureDeviceNodeParser = angular.module(
        'opentele-commons.questionnaireParser.bloodPressureDeviceNodeParser', [
            'opentele-commons.deviceListeners'
        ]);

    let bloodPressureDeviceNodeParserService = ($templateCache, parserUtils, nativeService, bloodPressureListener) => {

        const OMIT = 'Omit';
        const NEXT = 'Next';
        const BLOOD_PRESSURE = 'blood pressure';

        let nodeTemplate = parserUtils.getNodeTemplate('bloodPressureDeviceNode.html');

        let validate = (scope) => {
            let isValueEntered = () =>
                (scope.nodeModel.systolic !== undefined) &&
                (scope.nodeModel.diastolic !== undefined) &&
                (scope.nodeModel.pulse !== undefined);
            return isValueEntered();
        };

        let generateRepresentation = (node, nodeModel : NodeModel) => {

            let clickAction = (scope) => {

                let pulseName = node.pulse.name;
                let pulseType = node.pulse.type;
                let pulseValue = scope.nodeModel.pulse;
                scope.outputModel[pulseName] = {
                    name: pulseName,
                    type: pulseType,
                    value: pulseValue
                };

                let systolicName = node.systolic.name;
                let systolicType = node.systolic.type;
                let systolicValue = scope.nodeModel.systolic;
                scope.outputModel[systolicName] = {
                    name: systolicName,
                    type: systolicType,
                    value: systolicValue
                };

                let diastolicName = node.diastolic.name;
                let diastolicType = node.diastolic.type;
                let diastolicValue = scope.nodeModel.diastolic;
                scope.outputModel[diastolicName] = {
                    name: diastolicName,
                    type: diastolicType,
                    value: diastolicValue
                };

                let meanArterialPressureName =
                    node.meanArterialPressure.name;
                let meanArterialPressureType =
                    node.meanArterialPressure.type;
                let meanArterialPressureValue =
                    scope.nodeModel.meanArterialPressure;
                scope.outputModel[meanArterialPressureName] = {
                    name: meanArterialPressureName,
                    type: meanArterialPressureType,
                    value: meanArterialPressureValue
                };

                let deviceName = node.deviceId.name;
                let deviceType = node.deviceId.type;
                let deviceId = scope.nodeModel.deviceId;
                scope.outputModel[deviceName] = {
                    name: deviceName,
                    type: deviceType,
                    value: deviceId
                };
            };

            let leftButton : LeftButton = {
                text: OMIT,
                nextNodeId: node.nextFail
            };

            let rightButton : RightButton = {
                text: NEXT,
                nextNodeId: node.next,
                validate: validate,
                clickAction: clickAction
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
                heading: node.text,
                info: 'BLOOD_PRESSURE_CONNECT'
            };

            let eventListener : Function = bloodPressureListener.create(nodeModel);
            let nativeEventCallback : Function = (message) => {
                if (message.measurementType !== BLOOD_PRESSURE) {
                    return;
                }
                eventListener(message.event);
            };
            nativeService.subscribeToMultipleMessages('deviceMeasurementResponse', nativeEventCallback);
            nativeService.addDeviceListener(BLOOD_PRESSURE);

            let representation : Representation = generateRepresentation(node, nodeModel);
            return representation;
        };

        return parseNode;
    };

    bloodPressureDeviceNodeParser.service('bloodPressureDeviceNodeParser',
                                          bloodPressureDeviceNodeParserService);

}());
