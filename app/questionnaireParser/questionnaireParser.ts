(function () {
    'use strict';

    let questionnaireParser = angular.module('opentele-commons.questionnaireParser', [
        'opentele-commons.questionnaireParser.templates',
        'opentele-commons.questionnaireParser.utils',
        'opentele-commons.questionnaireParser.haemoglobinDeviceNodeParser',
        'opentele-commons.questionnaireParser.bloodSugarManualDeviceNodeParser',
        'opentele-commons.questionnaireParser.crpNodeParser',
        'opentele-commons.questionnaireParser.ioNodeParser',
        'opentele-commons.questionnaireParser.assignmentNodeParser',
        'opentele-commons.questionnaireParser.endNodeParser',
        'opentele-commons.questionnaireParser.decisionNodeParser',
        'opentele-commons.questionnaireParser.temperatureManualDeviceNodeParser',
        'opentele-commons.questionnaireParser.urineDeviceNodeParser',
        'opentele-commons.questionnaireParser.glucoseUrineDeviceNodeParser',
        'opentele-commons.questionnaireParser.bloodUrineDeviceNodeParser',
        'opentele-commons.questionnaireParser.nitriteUrineDeviceNodeParser',
        'opentele-commons.questionnaireParser.leukocytesUrineDeviceNodeParser',
        'opentele-commons.questionnaireParser.delayNodeParser',
        'opentele-commons.questionnaireParser.weightDeviceNodeParser',
        'opentele-commons.questionnaireParser.bloodPressureDeviceNodeParser',
        'opentele-commons.questionnaireParser.saturationDeviceNodeParser',
        'opentele-commons.questionnaireParser.saturationWithoutPulseDeviceNodeParser'
    ]);

    questionnaireParser.service('nodesParser', ($injector, parserUtils) => {

        let getParser = (nodeType) => {
            let firstNonUpperCaseCharacter = (str) => {
                for (let i = 0; i < str.length; i++) {
                    let c = str[i];
                    if (!('A' <= c && c <= 'Z')) {
                        if (i > 1) {
                            return i - 1;
                        } else {
                            return i;
                        }
                    }
                }
                return -1;
            };

            let idx = firstNonUpperCaseCharacter(nodeType);
            let parserName = nodeType.slice(0, idx).toLowerCase() + nodeType.slice(idx) + 'Parser';
            return $injector.get(parserName);
        };

        let hasParser = (nodeType) => {
            try {
                getParser(nodeType);
                return true;
            } catch (e) {
                return false;
            }
        };

        let parseNode = (currentNodeId, nodeMap, outputModel) => {
            let nodeToParse = nodeMap[currentNodeId];
            let nodeType = parserUtils.getNodeType(nodeToParse);
            if (!hasParser(nodeType)) {
                throw new TypeError('Node of type ' + nodeType + ' not supported');
            }

            let toRepresentation = getParser(nodeType);
            let parsed = toRepresentation(nodeToParse[nodeType], nodeMap, outputModel);
            if (!parsed.hasOwnProperty('nodeId')) {
                parsed.nodeId = nodeToParse[nodeType].nodeName;
            }
            return parsed;
        };

        let validateNodes = (nodeMap) => {
            let errorTypes = [];

            let nodes = [];
            for (let nodeId in nodeMap) {
                if (nodeMap.hasOwnProperty(nodeId)) {
                    nodes.push(nodeMap[nodeId]);
                }
            }

            if (nodes === null || nodes.length === 0) {
                throw new TypeError('Questionnaire Node list was empty or null.');
            }

            for (let i = 0; i < nodes.length; i++) {
                let node = nodes[i];
                let nodeType = parserUtils.getNodeType(node);
                if (!hasParser(nodeType)) {
                    errorTypes.push(nodeType);
                }
            }

            if (errorTypes.length > 0) {
                let error = new TypeError('The following Node types are not supported: ' + errorTypes);
                // TODO: Can't import opentele.exceptionHandler, what to do?
                //error.code = errorCodes.INVALID_QUESTIONNAIRE;
                throw error;
            }
        };

        let parser = {
            parse: (currentNodeId, nodeMap, outputModel) =>
                parseNode(currentNodeId, nodeMap, outputModel),
            validate: (nodeMap) =>
                validateNodes(nodeMap)
        };

        return parser;
    });
}());
