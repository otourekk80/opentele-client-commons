import {
    Representation, NodeModel, LeftButton, RightButton
} from 'parserTypes';

(function() {
    'use strict';

    let nitriteUrineDeviceNodeParser = angular.module('opentele-commons.questionnaireParser.nitriteUrineDeviceNodeParser', []);

    let service = ($templateCache, parserUtils) => {

        let parseNode = (node) => {

            let nodeModel : NodeModel = {
                heading: node.text,
                measurementSelections: [
                    'URINE_LEVEL_NEGATIVE', 'URINE_LEVEL_POSITIVE'
                ]
            };

            let leftButton : LeftButton = {
                text: "Omit",
                nextNodeId: node.nextFail
            };

            let nodeName = node.nitriteUrine.name;
            let formName = 'inputForm_' + parserUtils.hashCode(nodeName);
            let rightButton : RightButton = {
                text: "Next",
                nextNodeId: node.next,
                clickAction: (scope) => {
                    var nodeName = node.nitriteUrine.name;
                    var radix = 10;
                    scope.outputModel[nodeName] = {
                        name: nodeName,
                        type: node.nitriteUrine.type,
                        value: parseInt(scope.nodeModel.measurement, radix)
                    };
                },
                validate: (scope) => scope[formName].$dirty
            };

            let template = parserUtils.getNodeTemplate('urineLevel.html');
            template = parserUtils.replaceAll(template, '#form_name#', formName);

            let representation : Representation = {
                nodeTemplate: template,
                nodeModel: nodeModel,
                leftButton: leftButton,
                rightButton: rightButton
            };

            return representation;
        };

        return parseNode;
    };

    nitriteUrineDeviceNodeParser.service('nitriteUrineDeviceNodeParser', service);

}());
