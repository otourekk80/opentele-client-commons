(function () {
    'use strict';
    var assignmentNodeParser = angular.module('opentele-commons.questionnaireParser.assignmentNodeParser', []);
    assignmentNodeParser.service('assignmentNodeParser', ["nodesParser", function (nodesParser) {
        var parseAssignmentNode = function (node, nodeMap, outputModel) {
            var variableName = node.variable.name;
            outputModel[variableName] = {
                name: variableName,
                value: node.expression.value,
                type: node.variable.type
            };
            var nextNodeId = node.next;
            return nodesParser.parse(nextNodeId, nodeMap, outputModel);
        };
        return parseAssignmentNode;
    }]);
}());
//# sourceMappingURL=assignmentNodeParser.js.map
(function () {
    'use strict';
    var bloodPressureDeviceNodeParser = angular.module('opentele-commons.questionnaireParser.bloodPressureDeviceNodeParser', [
        'opentele-commons.deviceListeners'
    ]);
    var bloodPressureDeviceNodeParserService = ["$templateCache", "parserUtils", "nativeService", "bloodPressureListener", function ($templateCache, parserUtils, nativeService, bloodPressureListener) {
        var OMIT = 'Omit';
        var NEXT = 'Next';
        var BLOOD_PRESSURE = 'blood pressure';
        var nodeTemplate = parserUtils.getNodeTemplate('bloodPressureDeviceNode.html');
        var validate = function (scope) {
            var isValueEntered = function () {
                return (scope.nodeModel.systolic !== undefined) &&
                    (scope.nodeModel.diastolic !== undefined) &&
                    (scope.nodeModel.pulse !== undefined);
            };
            return isValueEntered();
        };
        var generateRepresentation = function (node, nodeModel) {
            var clickAction = function (scope) {
                var pulseName = node.pulse.name;
                var pulseType = node.pulse.type;
                var pulseValue = scope.nodeModel.pulse;
                scope.outputModel[pulseName] = {
                    name: pulseName,
                    type: pulseType,
                    value: pulseValue
                };
                var systolicName = node.systolic.name;
                var systolicType = node.systolic.type;
                var systolicValue = scope.nodeModel.systolic;
                scope.outputModel[systolicName] = {
                    name: systolicName,
                    type: systolicType,
                    value: systolicValue
                };
                var diastolicName = node.diastolic.name;
                var diastolicType = node.diastolic.type;
                var diastolicValue = scope.nodeModel.diastolic;
                scope.outputModel[diastolicName] = {
                    name: diastolicName,
                    type: diastolicType,
                    value: diastolicValue
                };
                var meanArterialPressureName = node.meanArterialPressure.name;
                var meanArterialPressureType = node.meanArterialPressure.type;
                var meanArterialPressureValue = scope.nodeModel.meanArterialPressure;
                scope.outputModel[meanArterialPressureName] = {
                    name: meanArterialPressureName,
                    type: meanArterialPressureType,
                    value: meanArterialPressureValue
                };
                var deviceName = node.deviceId.name;
                var deviceType = node.deviceId.type;
                var deviceId = scope.nodeModel.deviceId;
                scope.outputModel[deviceName] = {
                    name: deviceName,
                    type: deviceType,
                    value: deviceId
                };
            };
            var leftButton = {
                text: OMIT,
                nextNodeId: node.nextFail
            };
            var rightButton = {
                text: NEXT,
                nextNodeId: node.next,
                validate: validate,
                clickAction: clickAction
            };
            var representation = {
                nodeTemplate: nodeTemplate,
                nodeModel: nodeModel,
                leftButton: leftButton,
                rightButton: rightButton
            };
            return representation;
        };
        var parseNode = function (node, nodeMap, outputModel) {
            var nodeModel = {
                heading: node.text,
                info: 'BLOOD_PRESSURE_CONNECT'
            };
            var eventListener = bloodPressureListener.create(nodeModel);
            var nativeEventCallback = function (message) {
                if (message.measurementType !== BLOOD_PRESSURE) {
                    return;
                }
                eventListener(message.event);
            };
            nativeService.subscribeToMultipleMessages('deviceMeasurementResponse', nativeEventCallback);
            nativeService.addDeviceListener(BLOOD_PRESSURE);
            var representation = generateRepresentation(node, nodeModel);
            return representation;
        };
        return parseNode;
    }];
    bloodPressureDeviceNodeParser.service('bloodPressureDeviceNodeParser', bloodPressureDeviceNodeParserService);
}());
//# sourceMappingURL=bloodPressureDeviceNodeParser.js.map
(function () {
    'use strict';
    var bloodSugarManualDeviceNodeParser = angular.module('opentele-commons.questionnaireParser.bloodSugarManualDeviceNodeParser', []);
    var bloodSugarService = ["$templateCache", "parserUtils", function ($templateCache, parserUtils) {
        var parseNode = function (node) {
            var nodeModel = {
                heading: node.text
            };
            var leftButton = {
                text: "Omit",
                nextNodeId: node.nextFail
            };
            var rightButton = {
                text: "Next",
                nextNodeId: node.next,
                validate: function (scope) { return scope.bloodSugarForm.count.$valid; },
                clickAction: function (scope) {
                    var nodeName = node.bloodSugarMeasurements.name;
                    var isBeforeMeal = scope.nodeModel.bloodSugarManualBeforeMeal;
                    var isAfterMeal = scope.nodeModel.bloodSugarManualAfterMeal;
                    var timestamp = new Date().toISOString();
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
            var representation = {
                nodeTemplate: parserUtils.getNodeTemplate('bloodSugarManualDeviceNode.html'),
                nodeModel: nodeModel,
                leftButton: leftButton,
                rightButton: rightButton
            };
            return representation;
        };
        return parseNode;
    }];
    bloodSugarManualDeviceNodeParser.service('bloodSugarManualDeviceNodeParser', bloodSugarService);
}());
//# sourceMappingURL=bloodSugarManualDeviceNodeParser.js.map
(function () {
    'use strict';
    var crpNodeParser = angular.module('opentele-commons.questionnaireParser.crpNodeParser', []);
    crpNodeParser.service('crpNodeParser', ["$templateCache", "parserUtils", function ($templateCache, parserUtils) {
        var parseNode = function (node) {
            var nodeModel = {
                heading: node.text
            };
            var leftButton = {
                text: "Omit",
                nextNodeId: node.nextFail
            };
            var rightButton = {
                text: "Next",
                nextNodeId: node.next,
                validate: function (scope) {
                    var isLt5CheckedAndNothingElse = function () {
                        return (scope.nodeModel.crpLt5Measurement === true) &&
                            ((scope.nodeModel.crpCountMeasurement === undefined) ||
                                (scope.nodeModel.crpCountMeasurement === null) ||
                                (scope.nodeModel.crpCountMeasurement.length === 0));
                    };
                    var isValueEnteredAndNothingElse = function () {
                        return (scope.nodeModel.crpLt5Measurement !== true) &&
                            (scope.nodeModel.crpCountMeasurement !== undefined) &&
                            (scope.nodeModel.crpCountMeasurement !== null) &&
                            (0 <= scope.nodeModel.crpCountMeasurement) &&
                            (0 < scope.nodeModel.crpCountMeasurement.toString().length);
                    };
                    return isLt5CheckedAndNothingElse() ||
                        isValueEnteredAndNothingElse();
                },
                clickAction: function (scope) {
                    var nodeName = node.CRP.name;
                    var lt5 = scope.nodeModel.crpLt5Measurement;
                    var count = scope.nodeModel.crpCountMeasurement;
                    scope.outputModel[nodeName] = {
                        name: nodeName,
                        type: node.CRP.type,
                        value: (lt5 || count < 5) ? 0 : count
                    };
                }
            };
            var representation = {
                nodeTemplate: parserUtils.getNodeTemplate('crpNode.html'),
                nodeModel: nodeModel,
                leftButton: leftButton,
                rightButton: rightButton
            };
            return representation;
        };
        return parseNode = parseNode;
    }]);
}());
//# sourceMappingURL=crpNodeParser.js.map
(function () {
    'use strict';
    var decisionNodeParser = angular.module('opentele-commons.questionnaireParser.decisionNodeParser', []);
    decisionNodeParser.service('decisionNodeParser', ["nodesParser", function (nodesParser) {
        var getOperator = function (node) {
            var operator;
            for (var op in node.expression) {
                operator = op;
                break;
            }
            if (operator !== 'lt' && operator !== 'gt' && operator !== 'eq') {
                throw new Error('Unsupported operator: ' + operator);
            }
            return operator;
        };
        var getValueAndType = function (side, outputModel) {
            var valueAndType;
            if (side.type === 'name') {
                valueAndType = {
                    value: outputModel[side.value].value,
                    type: outputModel[side.value].type
                };
            }
            else {
                valueAndType = {
                    value: side.value,
                    type: side.type
                };
            }
            if (['Integer', 'Float', 'Boolean'].indexOf(valueAndType.type) < 0) {
                throw new Error('Type not supported: ' + valueAndType.type);
            }
            return valueAndType;
        };
        var evaluate = function (operator, left, right) {
            if (left.type !== right.type) {
                throw new TypeError('Type for left and right side must be the same. Left: ' +
                    left.type + ', right: ' + right.type);
            }
            switch (operator) {
                case 'lt':
                    if (left.type === 'Boolean') {
                        throw new TypeError('Boolean expression with operators other than eq not supported.');
                    }
                    return left.value < right.value;
                case 'gt':
                    if (left.type === 'Boolean') {
                        throw new TypeError('Boolean expression with operators other than eq not supported.');
                    }
                    return left.value > right.value;
                case 'eq':
                    return left.value === right.value;
            }
        };
        var parseNode = function (node, nodeMap, outputModel) {
            var operator = getOperator(node);
            var left = getValueAndType(node.expression[operator].left, outputModel);
            var right = getValueAndType(node.expression[operator].right, outputModel);
            var isTrue = evaluate(operator, left, right);
            var nextNodeId = isTrue === true ? node.next : node.nextFalse;
            return nodesParser.parse(nextNodeId, nodeMap, outputModel);
        };
        return parseNode;
    }]);
}());
//# sourceMappingURL=decisionNodeParser.js.map
(function () {
    'use strict';
    var delayNodeParser = angular.module('opentele-commons.questionnaireParser.delayNodeParser', []);
    delayNodeParser.service('delayNodeParser', ["$interval", "parserUtils", "nodesParser", function ($interval, parserUtils, nodesParser) {
        var parseNode = function (node, nodeMap) {
            var onTimerStopped = function (scope) {
                scope.nextNode(node.next, nodesParser, nodeMap);
            };
            var nodeModel = {
                nodeId: node.nodeName,
                heading: node.displayTextString,
                count: (node.countUp === true) ? 0 : node.countTime,
                countTime: node.countTime,
                countUp: node.countUp,
                onTimerStopped: onTimerStopped
            };
            var representation = {
                nodeTemplate: parserUtils.getNodeTemplate('delayNode.html'),
                nodeModel: nodeModel
            };
            return representation;
        };
        return parseNode;
    }]);
}());
//# sourceMappingURL=delayNodeParser.js.map
(function () {
    'use strict';
    var endNodeParser = angular.module('opentele-commons.questionnaireParser.endNodeParser', []);
    endNodeParser.service('endNodeParser', function () {
        var parseNode = function (node) {
            return {
                isEndNode: true
            };
        };
        return parseNode;
    });
}());
//# sourceMappingURL=endNodeParser.js.map
(function () {
    'use strict';
    var haemoglobinDeviceNodeParser = angular.module('opentele-commons.questionnaireParser.haemoglobinDeviceNodeParser', []);
    haemoglobinDeviceNodeParser.service('haemoglobinDeviceNodeParser', ["parserUtils", function (parserUtils) {
        var parseNode = function (node) {
            return parserUtils.parseSimpleInputNode(node, node.haemoglobinValue, 'HAEMOGLOBIN');
        };
        return parseNode;
    }]);
}());
//# sourceMappingURL=haemoglobinDeviceNodeParser.js.map
(function () {
    'use strict';
    var ioNodeParser = angular.module('opentele-commons.questionnaireParser.ioNodeParser', []);
    ioNodeParser.service('ioNodeParser', ["$templateCache", "parserUtils", function ($templateCache, parserUtils) {
        var parseNode = function (node) {
            var elementTemplates = [];
            var labels = [];
            var clickActions = [];
            var validateActions = [];
            var representation = {
                nodeModel: {}
            };
            var setupClickActions = function (skipValidation, buttonRepresentation) {
                if (skipValidation === true) {
                    return;
                }
                buttonRepresentation.clickAction = function (scope) {
                    for (var i = 0; i < clickActions.length; i++) {
                        clickActions[i](scope);
                    }
                };
                buttonRepresentation.validate = function (scope) {
                    for (var i = 0; i < clickActions.length; i++) {
                        if (validateActions[i](scope) === false) {
                            return false;
                        }
                    }
                    return true;
                };
            };
            var handleTextViewElement = function (element, representation, elementIndex, allElements) {
                labels.push(element.text);
            };
            var handleEditTextElement = function (element, representation) {
                var template = parserUtils.getNodeTemplate('ioNodeEditText.html');
                var elementType = element.outputVariable.type === 'String' ? 'text' : 'number';
                var editFieldName = 'input_' + elementType + '_' + parserUtils.hashCode(element.outputVariable.name);
                var formName = 'form_' + editFieldName;
                template = parserUtils.replaceAll(template, '#type#', element.outputVariable.type === 'String' ? 'text' : 'number');
                template = parserUtils.replaceAll(template, '#step#', element.outputVariable.type === 'Integer' ? '1' : 'any');
                template = parserUtils.replaceAll(template, '#form_name#', formName);
                template = parserUtils.replaceAll(template, '#input_name#', editFieldName);
                var labelText = labels.length > 0 ? labels.pop() : '';
                template = parserUtils.replaceAll(template, '#label#', labelText);
                elementTemplates.push(template);
                clickActions.push(function (scope) {
                    var variableName = element.outputVariable.name;
                    scope.outputModel[variableName] = {
                        name: variableName,
                        value: scope.nodeModel[editFieldName],
                        type: element.outputVariable.type
                    };
                });
                validateActions.push(function (scope) {
                    return scope[formName][editFieldName].$valid;
                });
            };
            var handleTwoButtonElement = function (element, representation) {
                var leftButton = {
                    text: element.leftText,
                    nextNodeId: element.leftNext
                };
                setupClickActions(element.leftSkipValidation, leftButton);
                representation.leftButton = leftButton;
                var rightButton = {
                    text: element.rightText,
                    nextNodeId: element.rightNext
                };
                setupClickActions(element.rightSkipValidation, rightButton);
                representation.rightButton = rightButton;
            };
            var handleButtonElement = function (element, representation) {
                var buttonRepresentation = {
                    text: element.text,
                    nextNodeId: element.next
                };
                setupClickActions(element.skipValidation, buttonRepresentation);
                switch (element.gravity) {
                    case "center":
                        representation.centerButton = buttonRepresentation;
                        break;
                    case "right":
                        representation.rightButton = buttonRepresentation;
                        break;
                    case "left":
                        representation.leftButton = buttonRepresentation;
                        break;
                }
            };
            var handleRadioButtonElement = function (element, representation) {
                var setValueAccordingToType = function (value, type) {
                    switch (type) {
                        case 'Float':
                            return parseFloat(value);
                        case 'Integer':
                            var radix = 10;
                            return parseInt(value, radix);
                        case 'String':
                            return value;
                        default:
                            console.log("Unknown type: " + type);
                            return value;
                    }
                };
                var template = parserUtils.getNodeTemplate('ioNodeRadioButton.html');
                var radioButtonName = 'input_' + elementTemplates.length;
                var formName = 'form_' + radioButtonName;
                representation.nodeModel.radioItems = element.choices.map(function (choice) {
                    return { label: choice.text, value: choice.value.value };
                });
                template = parserUtils.replaceAll(template, '#form_name#', formName);
                elementTemplates.push(template);
                clickActions.push(function (scope) {
                    var variableName = element.outputVariable.name;
                    var value = setValueAccordingToType(scope.nodeModel.radioSelected, element.outputVariable.type);
                    scope.outputModel[variableName] = {
                        name: variableName,
                        value: value,
                        type: element.outputVariable.type
                    };
                });
                validateActions.push(function (scope) { return scope[formName].$dirty; });
            };
            var elementHandlers = {
                TextViewElement: function (element, representation, elementIndex, allElements) {
                    handleTextViewElement(element, representation, elementIndex, allElements);
                },
                EditTextElement: function (element, representation) {
                    handleEditTextElement(element, representation);
                },
                ButtonElement: function (element, representation) {
                    handleButtonElement(element, representation);
                },
                TwoButtonElement: function (element, representation) {
                    handleTwoButtonElement(element, representation);
                },
                RadioButtonElement: function (element, representation) {
                    handleRadioButtonElement(element, representation);
                },
                HelpTextElement: function () { }
            };
            for (var i = 0; i < node.elements.length; i++) {
                var element = node.elements[i];
                var elementName = parserUtils.getNodeType(element);
                var handler = elementHandlers[elementName];
                handler(element[elementName], representation, i, node.elements);
            }
            elementTemplates.unshift(labels.map(function (label) {
                var template = parserUtils.getNodeTemplate('ioNodeText.html');
                return parserUtils.replaceAll(template, '#heading#', label);
            }));
            representation.nodeTemplate = elementTemplates.join('\n');
            return representation;
        };
        return parseNode;
    }]);
}());
//# sourceMappingURL=ioNodeParser.js.map
(function () {
    'use strict';
    var lungMonitorDeviceNodeParser = angular.module('opentele-commons.questionnaireParser.lungMonitorDeviceNodeParser', [
        'opentele-commons.deviceListeners'
    ]);
    var lungMonitorDeviceNodeParserService = ["$templateCache", "parserUtils", "nativeService", "lungFunctionListener", function ($templateCache, parserUtils, nativeService, lungFunctionListener) {
        var OMIT = 'Omit';
        var NEXT = 'Next';
        var LUNG_FUNCTION = 'lung function';
        var nodeTemplate = parserUtils.getNodeTemplate('lungMonitorDeviceNode.html');
        var validate = function (scope) {
            var isValueEntered = function () {
                return (scope.nodeModel.fev1 !== undefined) &&
                    (scope.nodeModel.fev6 !== undefined) &&
                    (scope.nodeModel.fev1Fev6Ratio !== undefined) &&
                    (scope.nodeModel.goodTest !== undefined) &&
                    (scope.nodeModel.softwareVersion !== undefined);
            };
            return isValueEntered();
        };
        var generateRepresentation = function (node, nodeModel) {
            var clickAction = function (scope) {
                var measurements = [
                    'fev1', 'fev6', 'fev1Fev6Ratio', 'fef2575',
                    'goodTest', 'softwareVersion', 'deviceId'
                ];
                measurements.forEach(function (measurement) {
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
            var leftButton = {
                text: OMIT,
                nextNodeId: node.nextFail
            };
            var rightButton = {
                text: NEXT,
                nextNodeId: node.next,
                validate: validate,
                clickAction: clickAction
            };
            var representation = {
                nodeTemplate: nodeTemplate,
                nodeModel: nodeModel,
                leftButton: leftButton,
                rightButton: rightButton
            };
            return representation;
        };
        var parseNode = function (node, nodeMap, outputModel) {
            var html5HookDescription = {
                elementId: 'deviceHook',
                modelName: 'nodeModel',
                callbackName: 'eventListener'
            };
            var nodeModel = {
                heading: node.text,
                info: 'CONNECTING'
            };
            var eventListener = lungFunctionListener.create(nodeModel);
            nodeModel.eventListener = eventListener;
            nativeService.addDeviceListener(LUNG_FUNCTION, html5HookDescription);
            var representation = generateRepresentation(node, nodeModel);
            return representation;
        };
        return parseNode;
    }];
    lungMonitorDeviceNodeParser.service('lungMonitorDeviceNodeParser', lungMonitorDeviceNodeParserService);
}());
//# sourceMappingURL=lungMonitorDeviceNodeParser.js.map
//# sourceMappingURL=parserTypes.js.map
(function () {
    'use strict';
    var parserUtils = angular.module('opentele-commons.questionnaireParser.utils', []);
    parserUtils.service('parserUtils', ["$templateCache", function ($templateCache) {
        var getFirstKeyFromLiteral = function (literal) {
            for (var key in literal) {
                if (literal.hasOwnProperty(key)) {
                    return key;
                }
            }
        };
        var getNodeTemplate = function (templateName) {
            var template = $templateCache.get('questionnaireParser/nodeTemplates/' + templateName);
            if (typeof template === 'undefined') {
                throw new Error('HTML template does not exist for ' + templateName);
            }
            return template;
        };
        var getNodeType = function (node) { return getFirstKeyFromLiteral(node); };
        var hashCode = function (str) {
            var hash = 0, i, chr, len;
            if (str.length === 0) {
                return hash;
            }
            for (i = 0, len = str.length; i < len; i++) {
                chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0;
            }
            return Math.abs(hash);
        };
        var replaceAll = function (str, find, replace) {
            var escapeRegExp = function (str) {
                return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
            };
            return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
        };
        var parseSimpleInputNode = function (node, nodeValueEntry, fieldName) {
            var isIntegerNode = nodeValueEntry.type === 'Integer';
            var template = getNodeTemplate('simpleInputNode.html');
            template = replaceAll(template, '#field_name#', fieldName);
            var numberPattern = isIntegerNode === true ? /^\d+$/ : /.+/;
            template = replaceAll(template, '#pattern#', numberPattern);
            var representation = {
                nodeTemplate: template,
                nodeModel: {
                    heading: node.text
                }
            };
            representation.rightButton = {
                text: "Next",
                nextNodeId: node.next,
                validate: function (scope) {
                    return scope.inputForm.value.$valid;
                },
                clickAction: function (scope) {
                    var nodeName = nodeValueEntry.name;
                    scope.outputModel[nodeName] = {
                        name: nodeName,
                        type: nodeValueEntry.type,
                        value: scope.nodeModel.measurement
                    };
                }
            };
            representation.leftButton = {
                text: "Omit",
                nextNodeId: node.nextFail
            };
            return representation;
        };
        return {
            getFirstKeyFromLiteral: getFirstKeyFromLiteral,
            getNodeTemplate: getNodeTemplate,
            getNodeType: getNodeType,
            hashCode: hashCode,
            parseSimpleInputNode: parseSimpleInputNode,
            replaceAll: replaceAll
        };
    }]);
}());
//# sourceMappingURL=parserUtils.js.map
(function () {
    'use strict';
    var questionnaireParser = angular.module('opentele-commons.questionnaireParser', [
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
    questionnaireParser.service('nodesParser', ["$injector", "parserUtils", function ($injector, parserUtils) {
        var getParser = function (nodeType) {
            var firstNonUpperCaseCharacter = function (str) {
                for (var i = 0; i < str.length; i++) {
                    var c = str[i];
                    if (!('A' <= c && c <= 'Z')) {
                        if (i > 1) {
                            return i - 1;
                        }
                        else {
                            return i;
                        }
                    }
                }
                return -1;
            };
            var idx = firstNonUpperCaseCharacter(nodeType);
            var parserName = nodeType.slice(0, idx).toLowerCase() + nodeType.slice(idx) + 'Parser';
            return $injector.get(parserName);
        };
        var hasParser = function (nodeType) {
            try {
                getParser(nodeType);
                return true;
            }
            catch (e) {
                return false;
            }
        };
        var parseNode = function (currentNodeId, nodeMap, outputModel) {
            var nodeToParse = nodeMap[currentNodeId];
            var nodeType = parserUtils.getNodeType(nodeToParse);
            if (!hasParser(nodeType)) {
                throw new TypeError('Node of type ' + nodeType + ' not supported');
            }
            var toRepresentation = getParser(nodeType);
            var parsed = toRepresentation(nodeToParse[nodeType], nodeMap, outputModel);
            if (!parsed.hasOwnProperty('nodeId')) {
                parsed.nodeId = nodeToParse[nodeType].nodeName;
            }
            return parsed;
        };
        var validateNodes = function (nodeMap) {
            var errorTypes = [];
            var nodes = [];
            for (var nodeId in nodeMap) {
                if (nodeMap.hasOwnProperty(nodeId)) {
                    nodes.push(nodeMap[nodeId]);
                }
            }
            if (nodes === null || nodes.length === 0) {
                throw new TypeError('Questionnaire Node list was empty or null.');
            }
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                var nodeType = parserUtils.getNodeType(node);
                if (!hasParser(nodeType)) {
                    errorTypes.push(nodeType);
                }
            }
            if (errorTypes.length > 0) {
                var error = new TypeError('The following Node types are not supported: ' + errorTypes);
                throw error;
            }
        };
        var parser = {
            parse: function (currentNodeId, nodeMap, outputModel) {
                return parseNode(currentNodeId, nodeMap, outputModel);
            },
            validate: function (nodeMap) {
                return validateNodes(nodeMap);
            }
        };
        return parser;
    }]);
}());
//# sourceMappingURL=questionnaireParser.js.map
(function () {
    'use strict';
    var saturationDeviceNodeParser = angular.module('opentele-commons.questionnaireParser.saturationDeviceNodeParser', [
        'opentele-commons.deviceListeners'
    ]);
    var saturationDeviceNodeParserService = ["$templateCache", "parserUtils", "nativeService", "saturationListener", function ($templateCache, parserUtils, nativeService, saturationListener) {
        var OMIT = 'Omit';
        var NEXT = 'Next';
        var SATURATION = 'saturation';
        var generateRepresentation = function (node, nodeModel) {
            var nodeTemplate = parserUtils.getNodeTemplate('saturationDeviceNode.html');
            var leftButton = {
                text: OMIT,
                nextNodeId: node.nextFail
            };
            var rightButton = {
                text: NEXT,
                nextNodeId: node.next,
                validate: function (scope) {
                    var isValueEntered = function () {
                        return (scope.nodeModel.saturation !== undefined) &&
                            (scope.nodeModel.pulse !== undefined);
                    };
                    return isValueEntered();
                },
                clickAction: function (scope) {
                    var saturationName = node.saturation.name;
                    var saturationType = node.saturation.type;
                    var saturationValue = scope.nodeModel.saturation;
                    scope.outputModel[saturationName] = {
                        name: saturationName,
                        type: saturationType,
                        value: saturationValue
                    };
                    var pulseName = node.pulse.name;
                    var pulseType = node.pulse.type;
                    var pulseValue = scope.nodeModel.pulse;
                    scope.outputModel[pulseName] = {
                        name: pulseName,
                        type: pulseType,
                        value: pulseValue
                    };
                    var deviceName = node.deviceId.name;
                    var deviceType = node.deviceId.type;
                    var deviceId = scope.nodeModel.deviceId;
                    scope.outputModel[deviceName] = {
                        name: deviceName,
                        type: deviceType,
                        value: deviceId
                    };
                }
            };
            var representation = {
                nodeTemplate: nodeTemplate,
                nodeModel: nodeModel,
                leftButton: leftButton,
                rightButton: rightButton
            };
            return representation;
        };
        var parseNode = function (node, nodeMap, outputModel) {
            var nodeModel = {
                heading: node.text
            };
            var eventListener = saturationListener.create(nodeModel, false);
            var nativeEventCallback = function (message) {
                if (message.measurementType !== SATURATION) {
                    return;
                }
                eventListener(message.event);
            };
            nativeService.subscribeToMultipleMessages('deviceMeasurementResponse', nativeEventCallback);
            nativeService.addDeviceListener(SATURATION);
            var representation = generateRepresentation(node, nodeModel);
            return representation;
        };
        return parseNode;
    }];
    saturationDeviceNodeParser.service('saturationDeviceNodeParser', saturationDeviceNodeParserService);
}());
//# sourceMappingURL=saturationDeviceNodeParser.js.map
(function () {
    'use strict';
    var saturationWithoutPulseDeviceNodeParser = angular.module('opentele-commons.questionnaireParser.saturationWithoutPulseDeviceNodeParser', [
        'opentele-commons.deviceListeners'
    ]);
    var saturationWithoutPulseDeviceNodeParserService = ["$templateCache", "parserUtils", "nativeService", "saturationListener", function ($templateCache, parserUtils, nativeService, saturationListener) {
        var OMIT = 'Omit';
        var NEXT = 'Next';
        var SATURATION = "saturation";
        var generateRepresentation = function (node, nodeModel) {
            var nodeTemplate = parserUtils.getNodeTemplate('saturationWithoutPulseDeviceNode.html');
            var leftButton = {
                text: OMIT,
                nextNodeId: node.nextFail
            };
            var rightButton = {
                text: NEXT,
                nextNodeId: node.next,
                validate: function (scope) {
                    var isValueEntered = function () { return (scope.nodeModel.saturation !== undefined); };
                    return isValueEntered();
                },
                clickAction: function (scope) {
                    var saturationName = node.saturation.name;
                    var saturationType = node.saturation.type;
                    var saturationValue = scope.nodeModel.saturation;
                    scope.outputModel[saturationName] = {
                        name: saturationName,
                        type: saturationType,
                        value: saturationValue
                    };
                    var deviceName = node.deviceId.name;
                    var deviceType = node.deviceId.type;
                    var deviceId = scope.nodeModel.deviceId;
                    scope.outputModel[deviceName] = {
                        name: deviceName,
                        type: deviceType,
                        value: deviceId
                    };
                }
            };
            var representation = {
                nodeTemplate: nodeTemplate,
                nodeModel: nodeModel,
                leftButton: leftButton,
                rightButton: rightButton
            };
            return representation;
        };
        var parseNode = function (node, nodeMap, outputModel) {
            var nodeModel = {
                heading: node.text
            };
            var eventListener = saturationListener.create(nodeModel, true);
            var nativeEventCallback = function (message) {
                if (message.measurementType !== SATURATION) {
                    return;
                }
                eventListener(message.event);
            };
            nativeService.subscribeToMultipleMessages('deviceMeasurementResponse', nativeEventCallback);
            nativeService.addDeviceListener(SATURATION);
            var representation = generateRepresentation(node, nodeModel);
            return representation;
        };
        return parseNode;
    }];
    saturationWithoutPulseDeviceNodeParser.service('saturationWithoutPulseDeviceNodeParser', saturationWithoutPulseDeviceNodeParserService);
}());
//# sourceMappingURL=saturationWithoutPulseDeviceNodeParser.js.map
(function () {
    'use strict';
    var temperatureDeviceNodeParser = angular.module('opentele-commons.questionnaireParser.temperatureManualDeviceNodeParser', []);
    var temperatureService = ["$templateCache", "parserUtils", function ($templateCache, parserUtils) {
        var parseNode = function (node) {
            var nodeModel = {
                heading: node.text
            };
            var leftButton = {
                text: "Omit",
                nextNodeId: node.nextFail
            };
            var rightButton = {
                text: "Next",
                nextNodeId: node.next,
                validate: function (scope) { return scope.temperatureForm.temperature.$valid; },
                clickAction: function (scope) {
                    var nodeName = node.temperature.name;
                    scope.outputModel[nodeName] = {
                        name: nodeName,
                        type: node.temperature.type,
                        value: scope.nodeModel.temperatureMeasurement
                    };
                }
            };
            var representation = {
                nodeTemplate: parserUtils.getNodeTemplate('temperatureManualDeviceNode.html'),
                nodeModel: nodeModel,
                leftButton: leftButton,
                rightButton: rightButton
            };
            return representation;
        };
        return parseNode;
    }];
    temperatureDeviceNodeParser.service('temperatureManualDeviceNodeParser', temperatureService);
}());
//# sourceMappingURL=temperatureManualDeviceNodeParser.js.map
angular.module('opentele-commons.questionnaireParser.templates', ['questionnaireParser/nodeTemplates/bloodPressureDeviceNode.html', 'questionnaireParser/nodeTemplates/bloodSugarManualDeviceNode.html', 'questionnaireParser/nodeTemplates/crpNode.html', 'questionnaireParser/nodeTemplates/delayNode.html', 'questionnaireParser/nodeTemplates/ioNodeEditText.html', 'questionnaireParser/nodeTemplates/ioNodeRadioButton.html', 'questionnaireParser/nodeTemplates/ioNodeText.html', 'questionnaireParser/nodeTemplates/lungMonitorDeviceNode.html', 'questionnaireParser/nodeTemplates/saturationDeviceNode.html', 'questionnaireParser/nodeTemplates/saturationWithoutPulseDeviceNode.html', 'questionnaireParser/nodeTemplates/simpleInputNode.html', 'questionnaireParser/nodeTemplates/temperatureManualDeviceNode.html', 'questionnaireParser/nodeTemplates/urineLevel.html', 'questionnaireParser/nodeTemplates/weightDeviceNode.html']);

angular.module("questionnaireParser/nodeTemplates/bloodPressureDeviceNode.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("questionnaireParser/nodeTemplates/bloodPressureDeviceNode.html",
    "<div class=\"center-div\">\n" +
    "    <h2 class=\"line-wrap\">{{ nodeModel.heading | translate }}</h2>\n" +
    "</div>\n" +
    "<div id=\"deviceHook\"></div>\n" +
    "<div class=\"center-div\">\n" +
    "    <h4 class=\"line-wrap\">{{ nodeModel.info | translate }}</h4>\n" +
    "</div>\n" +
    "<form name=\"bloodPressureForm\" class=\"text-center\">\n" +
    "    <fieldset class=\"questionnaire-fields\">\n" +
    "        <div class=\"block\">\n" +
    "            <label for=\"blood-pressure-systolic\">{{ \"BLOOD_PRESSURE_SYSTOLIC\" | translate }}</label>\n" +
    "            <input id=\"blood-pressure-systolic\"\n" +
    "                   type=\"number\"\n" +
    "                   name=\"blood-pressure-systolic\"\n" +
    "                   ng-model=\"nodeModel.systolic\"\n" +
    "                   disabled />\n" +
    "        </div>\n" +
    "        <div class=\"block\">\n" +
    "            <label for=\"blood-pressure-diastolic\">{{ \"BLOOD_PRESSURE_DIASTOLIC\" | translate }}</label>\n" +
    "            <input id=\"blood-pressure-diastolic\"\n" +
    "                   type=\"number\"\n" +
    "                   name=\"blood-pressure-diastolic\"\n" +
    "                   ng-model=\"nodeModel.diastolic\"\n" +
    "                   disabled />\n" +
    "        </div>\n" +
    "        <div class=\"block\">\n" +
    "            <label for=\"blood-pressure-pulse\">{{ \"BLOOD_PRESSURE_PULSE\" | translate }}</label>\n" +
    "            <input id=\"blood-pressure-pulse\"\n" +
    "                   type=\"number\"\n" +
    "                   name=\"blood-pressure-pulse\"\n" +
    "                   ng-model=\"nodeModel.pulse\"\n" +
    "                   disabled />\n" +
    "        </div>\n" +
    "        <div class=\"block\"\n" +
    "             ng-show=\"nodeModel.error !== undefined\">\n" +
    "            <small class=\"error-message\">{{ nodeModel.error | translate }}</small>\n" +
    "        </div>\n" +
    "    </fieldset>\n" +
    "</form>\n" +
    "");
}]);

angular.module("questionnaireParser/nodeTemplates/bloodSugarManualDeviceNode.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("questionnaireParser/nodeTemplates/bloodSugarManualDeviceNode.html",
    "<div class=\"center-div\">\n" +
    "    <h2 class=\"line-wrap\">{{nodeModel.heading}}</h2>\n" +
    "</div>\n" +
    "<form name=\"bloodSugarForm\" class=\"text-center\">\n" +
    "    <fieldset class=\"questionnaire-fields\">\n" +
    "        <div>\n" +
    "            <label for=\"count\">{{ \"BLOOD_SUGAR\" | translate }}</label>\n" +
    "            <input id=\"count\"\n" +
    "                   type=\"number\"\n" +
    "                   min=\"0\"\n" +
    "                   max=\"999\"\n" +
    "                   name=\"count\"\n" +
    "                   autocomplete=\"off\"\n" +
    "                   ng-model=\"nodeModel.bloodSugarManualMeasurement\" required />\n" +
    "        </div>\n" +
    "        <div ng-show=\"bloodSugarForm.count.$dirty && bloodSugarForm.count.$invalid\">\n" +
    "            <small class=\"error-message\"\n" +
    "                   ng-show=\"bloodSugarForm.count.$error.required\">\n" +
    "                {{ \"BLOOD_SUGAR_COUNT_ERROR_MESSAGE\" | translate }}\n" +
    "            </small>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <label for=\"beforeMeal\">{{ \"BEFORE_MEAL\" | translate }}</label>\n" +
    "            <input id=\"beforeMeal\"\n" +
    "                   type=\"checkbox\"\n" +
    "                   ng-model=\"nodeModel.bloodSugarManualBeforeMeal\"/>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <label for=\"afterMeal\">{{ \"AFTER_MEAL\" | translate }}</label>\n" +
    "            <input id=\"afterMeal\"\n" +
    "                   type=\"checkbox\"\n" +
    "                   ng-model=\"nodeModel.bloodSugarManualAfterMeal\"/>\n" +
    "        </div>\n" +
    "    </fieldset>\n" +
    "</form>\n" +
    "");
}]);

angular.module("questionnaireParser/nodeTemplates/crpNode.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("questionnaireParser/nodeTemplates/crpNode.html",
    "<div class=\"center-div\">\n" +
    "    <h2 class=\"line-wrap\">{{nodeModel.heading}}</h2>\n" +
    "</div>\n" +
    "<form name=\"crpForm\" class=\"text-center\">\n" +
    "    <fieldset class=\"questionnaire-fields\">\n" +
    "\n" +
    "        <div>\n" +
    "            <label for=\"lt5\">{{ \"LT5\" | translate }}</label>\n" +
    "            <input id=\"lt5\"\n" +
    "                   name=\"lt5\"\n" +
    "                   type=\"checkbox\"\n" +
    "                   ng-model=\"nodeModel.crpLt5Measurement\"/>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <label for=\"count\">{{ \"OR_CRP\" | translate }}</label>\n" +
    "            <input id=\"count\"\n" +
    "                   type=\"number\"\n" +
    "                   name=\"count\"\n" +
    "                   autocomplete=\"off\"\n" +
    "                   ng-model=\"nodeModel.crpCountMeasurement\"/>\n" +
    "        </div>\n" +
    "\n" +
    "    </fieldset>\n" +
    "</form>\n" +
    "");
}]);

angular.module("questionnaireParser/nodeTemplates/delayNode.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("questionnaireParser/nodeTemplates/delayNode.html",
    "<div class=\"center-div\">\n" +
    "	<h2 class=\"line-wrap\">{{nodeModel.heading}}</h2>\n" +
    "</div>\n" +
    "<div timer=\"nodeModel.nodeId\"></div>\n" +
    "<div class=\"center-div\">\n" +
    "	<h2 class=\"line-wrap\">{{nodeModel.timerDescription}}</h2>\n" +
    "</div>\n" +
    "");
}]);

angular.module("questionnaireParser/nodeTemplates/ioNodeEditText.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("questionnaireParser/nodeTemplates/ioNodeEditText.html",
    "<form name=\"#form_name#\" class=\"text-center\">\n" +
    "	<fieldset class=\"questionnaire-fields\">\n" +
    "		<div class=\"block\">\n" +
    "			<label for=\"#input_name#\">#label#</label>\n" +
    "			<input id=\"#input_name#\"\n" +
    "                   type=\"#type#\"\n" +
    "                   step=\"#step#\"\n" +
    "                   name=\"#input_name#\"\n" +
    "                   autocomplete=\"off\"\n" +
    "                   ng-model=\"nodeModel.#input_name#\" required />\n" +
    "		</div>\n" +
    "		<div class=\"block\"\n" +
    "             ng-show=\"#form_name#.#input_name#.$dirty && #form_name#.#input_name#.$invalid\">\n" +
    "			<small class=\"error-message\"\n" +
    "                   ng-show=\"#form_name#.#input_name#.$error.required\">{{ \"EDIT_TEXT_ELEMENT_ERROR_MESSAGE\" | translate }}</small>\n" +
    "		</div>\n" +
    "	</fieldset>\n" +
    "</form>\n" +
    "");
}]);

angular.module("questionnaireParser/nodeTemplates/ioNodeRadioButton.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("questionnaireParser/nodeTemplates/ioNodeRadioButton.html",
    "<form name=\"#form_name#\" class=\"text-center\">\n" +
    "    <fieldset class=\"questionnaire-fields\">\n" +
    "        <div class=\"narrow-row\"\n" +
    "             ng-repeat=\"radioItem in nodeModel.radioItems\">\n" +
    "            <input id=\"radio-items\"\n" +
    "                   name=\"radio-items\"\n" +
    "                   type=\"radio\"\n" +
    "                   value=\"{{radioItem.value}}\"\n" +
    "                   ng-model=\"nodeModel.radioSelected\">\n" +
    "            <div class=\"radio-label\" for=\"radio-items\">\n" +
    "              {{radioItem.label}}<br/>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </fieldset>\n" +
    "</form>\n" +
    "");
}]);

angular.module("questionnaireParser/nodeTemplates/ioNodeText.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("questionnaireParser/nodeTemplates/ioNodeText.html",
    "<div class=\"center-div\">\n" +
    "	<h2 class=\"line-wrap\">#heading#</h2>\n" +
    "</div>\n" +
    "");
}]);

angular.module("questionnaireParser/nodeTemplates/lungMonitorDeviceNode.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("questionnaireParser/nodeTemplates/lungMonitorDeviceNode.html",
    "<div class=\"center-div\">\n" +
    "    <h2 class=\"line-wrap\">{{ nodeModel.heading | translate }}</h2>\n" +
    "</div>\n" +
    "<div id=\"deviceHook\"></div>\n" +
    "<div class=\"center-div\">\n" +
    "    <h4 class=\"line-wrap\">{{ nodeModel.info | translate }}</h4>\n" +
    "</div>\n" +
    "<form name=\"lungFunctionForm\" class=\"text-center\">\n" +
    "    <fieldset class=\"questionnaire-fields\">\n" +
    "        <div class=\"block\">\n" +
    "            <label for=\"lung-function-fev1\">{{ \"LUNG_FUNCTION_FEV1\" | translate }}</label>\n" +
    "            <input id=\"lung-function-fev1\"\n" +
    "                   type=\"number\"\n" +
    "                   name=\"lung-function-fev1\"\n" +
    "                   ng-model=\"nodeModel.fev1\"\n" +
    "                   disabled />\n" +
    "        </div>\n" +
    "        <div class=\"block\"\n" +
    "             ng-show=\"nodeModel.error !== undefined\">\n" +
    "            <small class=\"error-message\">{{ nodeModel.error | translate }}</small>\n" +
    "        </div>\n" +
    "    </fieldset>\n" +
    "</form>\n" +
    "");
}]);

angular.module("questionnaireParser/nodeTemplates/saturationDeviceNode.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("questionnaireParser/nodeTemplates/saturationDeviceNode.html",
    "<div class=\"center-div\">\n" +
    "	<h2 class=\"line-wrap\">{{nodeModel.heading | translate }}</h2>\n" +
    "</div>\n" +
    "<div id=\"deviceHook\"></div>\n" +
    "<div class=\"center-div\">\n" +
    "	<h4 class=\"line-wrap\">{{ nodeModel.info | translate }}</h4>\n" +
    "</div>\n" +
    "<form name=\"saturationForm\" class=\"text-center\">\n" +
    "	<fieldset class=\"questionnaire-fields\">\n" +
    "		<div class=\"block\">\n" +
    "			<label for=\"saturation-saturation\">{{ \"SATURATION_SATURATION\" | translate }}</label>\n" +
    "			<input id=\"saturation-saturation\"\n" +
    "             type=\"number\"\n" +
    "             name=\"saturation-saturation\"\n" +
    "             ng-model=\"nodeModel.saturation\"\n" +
    "             disabled />\n" +
    "		</div>\n" +
    "		<div class=\"block\">\n" +
    "			<label for=\"saturation-pulse\">{{ \"SATURATION_PULSE\" | translate }}</label>\n" +
    "			<input id=\"saturation-pulse\"\n" +
    "             type=\"number\"\n" +
    "             name=\"saturation-pulse\"\n" +
    "             ng-model=\"nodeModel.pulse\"\n" +
    "             disabled />\n" +
    "		</div>\n" +
    "		<div class=\"block\"\n" +
    "             ng-show=\"nodeModel.error !== undefined\">\n" +
    "			<small class=\"error-message\">{{ nodeModel.error | translate }}</small>\n" +
    "		</div>\n" +
    "	</fieldset>\n" +
    "</form>\n" +
    "");
}]);

angular.module("questionnaireParser/nodeTemplates/saturationWithoutPulseDeviceNode.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("questionnaireParser/nodeTemplates/saturationWithoutPulseDeviceNode.html",
    "<div class=\"center-div\">\n" +
    "	<h2 class=\"line-wrap\">{{nodeModel.heading | translate }}</h2>\n" +
    "</div>\n" +
    "<div id=\"deviceHook\"></div>\n" +
    "<div class=\"center-div\">\n" +
    "	<h4 class=\"line-wrap\">{{ nodeModel.info | translate }}</h4>\n" +
    "</div>\n" +
    "<form name=\"saturationForm\" class=\"text-center\">\n" +
    "	<fieldset class=\"questionnaire-fields\">\n" +
    "		<div class=\"block\">\n" +
    "			<label for=\"saturation-saturation\">{{ \"SATURATION_SATURATION\" | translate }}</label>\n" +
    "			<input id=\"saturation-saturation\"\n" +
    "             type=\"number\"\n" +
    "             name=\"saturation-saturation\"\n" +
    "             ng-model=\"nodeModel.saturation\"\n" +
    "             disabled />\n" +
    "		</div>\n" +
    "		<div class=\"block\"\n" +
    "             ng-show=\"nodeModel.error !== undefined\">\n" +
    "			<small class=\"error-message\">{{ nodeModel.error | translate }}</small>\n" +
    "		</div>\n" +
    "	</fieldset>\n" +
    "</form>\n" +
    "");
}]);

angular.module("questionnaireParser/nodeTemplates/simpleInputNode.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("questionnaireParser/nodeTemplates/simpleInputNode.html",
    "<div class=\"center-div\">\n" +
    "	<h2 class=\"line-wrap\">{{nodeModel.heading}}</h2>\n" +
    "</div>\n" +
    "<form name=\"inputForm\" class=\"text-center\">\n" +
    "	<fieldset class=\"questionnaire-fields\">\n" +
    "		<div>\n" +
    "			<label for=\"value\">{{ \"#field_name#\" | translate }}</label>\n" +
    "			<input id=\"value\"\n" +
    "				type=\"number\"\n" +
    "				min=\"0\"\n" +
    "				max=\"999\"\n" +
    "				name=\"value\"\n" +
    "                autocomplete=\"off\"\n" +
    "				ng-model=\"nodeModel.measurement\" required ng-pattern=\"#pattern#\"/>\n" +
    "		</div>\n" +
    "		<div ng-show=\"inputForm.value.$dirty && inputForm.value.$invalid\">\n" +
    "			<small class=\"error-message\"\n" +
    "				ng-show=\"inputForm.value.$error.required\">\n" +
    "				{{ \"#field_name#_ERROR_MESSAGE\" | translate }}\n" +
    "			</small>\n" +
    "			<small class=\"error-message\"\n" +
    "				ng-show=\"inputForm.value.$error.pattern\">\n" +
    "				{{ \"#field_name#_ERROR_MESSAGE\" | translate }}\n" +
    "			</small>\n" +
    "		</div>\n" +
    "	</fieldset>\n" +
    "</form>\n" +
    "");
}]);

angular.module("questionnaireParser/nodeTemplates/temperatureManualDeviceNode.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("questionnaireParser/nodeTemplates/temperatureManualDeviceNode.html",
    "<div class=\"center-div\">\n" +
    "    <h2 class=\"line-wrap\">{{nodeModel.heading}}</h2>\n" +
    "</div>\n" +
    "<form name=\"temperatureForm\" class=\"text-center\">\n" +
    "    <fieldset class=\"questionnaire-fields\">\n" +
    "        <div>\n" +
    "            <label for=\"temperature\">{{ \"TEMPERATURE\" | translate }}</label>\n" +
    "            <input id=\"temperature\"\n" +
    "                   type=\"number\"\n" +
    "                   name=\"temperature\"\n" +
    "                   autocomplete=\"off\"\n" +
    "                   ng-model=\"nodeModel.temperatureMeasurement\" required />\n" +
    "        </div>\n" +
    "        <div ng-show=\"temperatureForm.temperature.$dirty && temperatureForm.temperature.$invalid\">\n" +
    "            <small class=\"error-message\"\n" +
    "                   ng-show=\"temperatureForm.temperature.$error.required\">\n" +
    "                {{ \"TEMPERATURE_ERROR_MESSAGE\" | translate }}\n" +
    "            </small>\n" +
    "        </div>\n" +
    "    </fieldset>\n" +
    "</form>\n" +
    "");
}]);

angular.module("questionnaireParser/nodeTemplates/urineLevel.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("questionnaireParser/nodeTemplates/urineLevel.html",
    "<div class=\"center-div\">\n" +
    "    <h2 class=\"line-wrap\">{{nodeModel.heading}}</h2>\n" +
    "</div>\n" +
    "<form name=\"#form_name#\" class=\"text-center\">\n" +
    "    <fieldset class=\"questionnaire-fields\">\n" +
    "        <div>\n" +
    "            <ul>\n" +
    "                <li class=\"narrow-row list-unstyled\"\n" +
    "                    ng-repeat=\"level in nodeModel.measurementSelections\">\n" +
    "                    <input id=\"radio-{{$index}}\"\n" +
    "                           name=\"radio-{{$index}}\"\n" +
    "                           type=\"radio\"\n" +
    "                           ng-model=\"nodeModel.measurement\"\n" +
    "                           value=\"{{$index}}\">\n" +
    "                    <div class=\"radio-label\">\n" +
    "                        {{ level | translate}}<br/>\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </fieldset>\n" +
    "</form>\n" +
    "");
}]);

angular.module("questionnaireParser/nodeTemplates/weightDeviceNode.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("questionnaireParser/nodeTemplates/weightDeviceNode.html",
    "<div class=\"center-div\">\n" +
    "	<h2 class=\"line-wrap\">{{nodeModel.heading | translate }}</h2>\n" +
    "</div>\n" +
    "<div id=\"deviceHook\"></div>\n" +
    "<div class=\"center-div\">\n" +
    "	<h4 class=\"line-wrap\">{{ nodeModel.info | translate }}</h4>\n" +
    "</div>\n" +
    "<form name=\"weightForm\" class=\"text-center\">\n" +
    "	<fieldset class=\"questionnaire-fields\">\n" +
    "		<div class=\"block\">\n" +
    "			<label for=\"weight-measurement\">{{ \"WEIGHT\" | translate }}</label>\n" +
    "			<input id=\"weight-measurement\"\n" +
    "             type=\"number\"\n" +
    "             name=\"weight-measurement\"\n" +
    "             ng-model=\"nodeModel.weight\"\n" +
    "             disabled />\n" +
    "		</div>\n" +
    "		<div class=\"block\"\n" +
    "             ng-show=\"nodeModel.error !== undefined\">\n" +
    "			<small class=\"error-message\">{{ nodeModel.error | translate }}</small>\n" +
    "		</div>\n" +
    "	</fieldset>\n" +
    "</form>\n" +
    "");
}]);

(function () {
    'use strict';
    var bloodUrineDeviceNodeParser = angular.module('opentele-commons.questionnaireParser.bloodUrineDeviceNodeParser', []);
    var service = ["$templateCache", "parserUtils", function ($templateCache, parserUtils) {
        var parseNode = function (node) {
            var nodeModel = {
                heading: node.text,
                measurementSelections: [
                    'URINE_LEVEL_NEGATIVE', 'URINE_LEVEL_PLUS_MINUS',
                    'URINE_LEVEL_PLUS_ONE', 'URINE_LEVEL_PLUS_TWO',
                    'URINE_LEVEL_PLUS_THREE'
                ]
            };
            var leftButton = {
                text: "Omit",
                nextNodeId: node.nextFail
            };
            var nodeName = node.bloodUrine.name;
            var formName = 'inputForm_' + parserUtils.hashCode(nodeName);
            var rightButton = {
                text: "Next",
                nextNodeId: node.next,
                clickAction: function (scope) {
                    var radix = 10;
                    scope.outputModel[nodeName] = {
                        name: nodeName,
                        type: node.bloodUrine.type,
                        value: parseInt(scope.nodeModel.measurement, radix)
                    };
                },
                validate: function (scope) { return scope[formName].$dirty; }
            };
            var template = parserUtils.getNodeTemplate('urineLevel.html');
            template = parserUtils.replaceAll(template, '#form_name#', formName);
            var representation = {
                nodeTemplate: template,
                nodeModel: nodeModel,
                leftButton: leftButton,
                rightButton: rightButton
            };
            return representation;
        };
        return parseNode;
    }];
    bloodUrineDeviceNodeParser.service('bloodUrineDeviceNodeParser', service);
}());
//# sourceMappingURL=urineBloodDeviceNodeParser.js.map
(function () {
    'use strict';
    var urineDeviceNodeParser = angular.module('opentele-commons.questionnaireParser.urineDeviceNodeParser', []);
    urineDeviceNodeParser.service('urineDeviceNodeParser', ["$templateCache", "parserUtils", function ($templateCache, parserUtils) {
        var parseNode = function (node) {
            var nodeModel = {
                heading: node.text,
                measurementSelections: [
                    'URINE_LEVEL_NEGATIVE', 'URINE_LEVEL_PLUS_MINUS',
                    'URINE_LEVEL_PLUS_ONE', 'URINE_LEVEL_PLUS_TWO',
                    'URINE_LEVEL_PLUS_THREE', 'URINE_LEVEL_PLUS_FOUR'
                ]
            };
            var leftButton = {
                text: "Omit",
                nextNodeId: node.nextFail
            };
            var nodeName = node.urine.name;
            var formName = 'inputForm_' + parserUtils.hashCode(nodeName);
            var rightButton = {
                text: "Next",
                nextNodeId: node.next,
                clickAction: function (scope) {
                    var radix = 10;
                    scope.outputModel[nodeName] = {
                        name: nodeName,
                        type: node.urine.type,
                        value: parseInt(scope.nodeModel.measurement, radix)
                    };
                },
                validate: function (scope) { return scope[formName].$dirty; }
            };
            var template = parserUtils.getNodeTemplate('urineLevel.html');
            template = parserUtils.replaceAll(template, '#form_name#', formName);
            var representation = {
                nodeTemplate: template,
                nodeModel: nodeModel,
                leftButton: leftButton,
                rightButton: rightButton
            };
            return representation;
        };
        return parseNode;
    }]);
}());
//# sourceMappingURL=urineDeviceNodeParser.js.map
(function () {
    'use strict';
    var glucoseUrineDeviceNodeParser = angular.module('opentele-commons.questionnaireParser.glucoseUrineDeviceNodeParser', []);
    glucoseUrineDeviceNodeParser.service('glucoseUrineDeviceNodeParser', ["$templateCache", "parserUtils", function ($templateCache, parserUtils) {
        var parseNode = function (node) {
            var nodeModel = {
                heading: node.text,
                measurementSelections: [
                    'URINE_LEVEL_NEGATIVE', 'URINE_LEVEL_PLUS_ONE',
                    'URINE_LEVEL_PLUS_TWO', 'URINE_LEVEL_PLUS_THREE',
                    'URINE_LEVEL_PLUS_FOUR'
                ]
            };
            var leftButton = {
                text: "Omit",
                nextNodeId: node.nextFail
            };
            var nodeName = node.glucoseUrine.name;
            var formName = 'inputForm_' + parserUtils.hashCode(nodeName);
            var rightButton = {
                text: "Next",
                nextNodeId: node.next,
                clickAction: function (scope) {
                    var radix = 10;
                    scope.outputModel[nodeName] = {
                        name: nodeName,
                        type: node.glucoseUrine.type,
                        value: parseInt(scope.nodeModel.measurement, radix)
                    };
                },
                validate: function (scope) { return scope[formName].$dirty; }
            };
            var template = parserUtils.getNodeTemplate('urineLevel.html');
            template = parserUtils.replaceAll(template, '#form_name#', formName);
            var representation = {
                nodeTemplate: template,
                nodeModel: nodeModel,
                leftButton: leftButton,
                rightButton: rightButton
            };
            return representation;
        };
        return parseNode;
    }]);
}());
//# sourceMappingURL=urineGlucoseDeviceNodeParser.js.map
(function () {
    'use strict';
    var leukocytesUrineDeviceNodeParser = angular.module('opentele-commons.questionnaireParser.leukocytesUrineDeviceNodeParser', []);
    var service = ["$templateCache", "parserUtils", function ($templateCache, parserUtils) {
        var parseNode = function (node) {
            var nodeModel = {
                heading: node.text,
                measurementSelections: [
                    'URINE_LEVEL_NEGATIVE', 'URINE_LEVEL_PLUS_ONE',
                    'URINE_LEVEL_PLUS_TWO', 'URINE_LEVEL_PLUS_THREE'
                ]
            };
            var leftButton = {
                text: "Omit",
                nextNodeId: node.nextFail
            };
            var nodeName = node.leukocytesUrine.name;
            var formName = 'inputForm_' + parserUtils.hashCode(nodeName);
            var rightButton = {
                text: "Next",
                nextNodeId: node.next,
                clickAction: function (scope) {
                    var radix = 10;
                    scope.outputModel[nodeName] = {
                        name: nodeName,
                        type: node.leukocytesUrine.type,
                        value: parseInt(scope.nodeModel.measurement, radix)
                    };
                },
                validate: function (scope) { return scope[formName].$dirty; }
            };
            var template = parserUtils.getNodeTemplate('urineLevel.html');
            template = parserUtils.replaceAll(template, '#form_name#', formName);
            var representation = {
                nodeTemplate: template,
                nodeModel: nodeModel,
                leftButton: leftButton,
                rightButton: rightButton
            };
            return representation;
        };
        return parseNode;
    }];
    leukocytesUrineDeviceNodeParser.service('leukocytesUrineDeviceNodeParser', service);
}());
//# sourceMappingURL=urineLeukocytesDeviceNodeParser.js.map
(function () {
    'use strict';
    var nitriteUrineDeviceNodeParser = angular.module('opentele-commons.questionnaireParser.nitriteUrineDeviceNodeParser', []);
    var service = ["$templateCache", "parserUtils", function ($templateCache, parserUtils) {
        var parseNode = function (node) {
            var nodeModel = {
                heading: node.text,
                measurementSelections: [
                    'URINE_LEVEL_NEGATIVE', 'URINE_LEVEL_POSITIVE'
                ]
            };
            var leftButton = {
                text: "Omit",
                nextNodeId: node.nextFail
            };
            var nodeName = node.nitriteUrine.name;
            var formName = 'inputForm_' + parserUtils.hashCode(nodeName);
            var rightButton = {
                text: "Next",
                nextNodeId: node.next,
                clickAction: function (scope) {
                    var nodeName = node.nitriteUrine.name;
                    var radix = 10;
                    scope.outputModel[nodeName] = {
                        name: nodeName,
                        type: node.nitriteUrine.type,
                        value: parseInt(scope.nodeModel.measurement, radix)
                    };
                },
                validate: function (scope) { return scope[formName].$dirty; }
            };
            var template = parserUtils.getNodeTemplate('urineLevel.html');
            template = parserUtils.replaceAll(template, '#form_name#', formName);
            var representation = {
                nodeTemplate: template,
                nodeModel: nodeModel,
                leftButton: leftButton,
                rightButton: rightButton
            };
            return representation;
        };
        return parseNode;
    }];
    nitriteUrineDeviceNodeParser.service('nitriteUrineDeviceNodeParser', service);
}());
//# sourceMappingURL=urineNitriteDeviceNodeParser.js.map
(function () {
    'use strict';
    var weightDeviceNodeParser = angular.module('opentele-commons.questionnaireParser.weightDeviceNodeParser', [
        'opentele-commons.deviceListeners'
    ]);
    var weightDeviceNodeParserService = ["$templateCache", "parserUtils", "nativeService", "weightListener", function ($templateCache, parserUtils, nativeService, weightListener) {
        var OMIT = 'Omit';
        var NEXT = 'Next';
        var WEIGHT = 'weight';
        var generateRepresentation = function (node, nodeModel) {
            var nodeTemplate = parserUtils.getNodeTemplate('weightDeviceNode.html');
            var leftButton = {
                text: OMIT,
                nextNodeId: node.nextFail
            };
            var rightButton = {
                text: NEXT,
                nextNodeId: node.next,
                validate: function (scope) {
                    var isValueEntered = function () { return scope.nodeModel.weight !== undefined; };
                    return isValueEntered();
                },
                clickAction: function (scope) {
                    var weightName = node.weight.name;
                    var weightType = node.weight.type;
                    var weightValue = scope.nodeModel.weight;
                    scope.outputModel[weightName] = {
                        name: weightName,
                        type: weightType,
                        value: weightValue
                    };
                    var deviceName = node.deviceId.name;
                    var deviceType = node.deviceId.type;
                    var deviceId = scope.nodeModel.deviceId;
                    scope.outputModel[deviceName] = {
                        name: deviceName,
                        type: deviceType,
                        value: deviceId
                    };
                }
            };
            var representation = {
                nodeTemplate: nodeTemplate,
                nodeModel: nodeModel,
                leftButton: leftButton,
                rightButton: rightButton
            };
            return representation;
        };
        var parseNode = function (node, nodeMap, outputModel) {
            var nodeModel = {
                heading: "WEIGHT",
                info: node.text
            };
            var eventListener = weightListener.create(nodeModel);
            var nativeEventCallback = function (message) {
                if (message.measurementType !== WEIGHT) {
                    return;
                }
                eventListener(message.event);
            };
            nativeService.subscribeToMultipleMessages('deviceMeasurementResponse', nativeEventCallback);
            nativeService.addDeviceListener(WEIGHT);
            var representation = generateRepresentation(node, nodeModel);
            return representation;
        };
        return parseNode;
    }];
    weightDeviceNodeParser.service('weightDeviceNodeParser', weightDeviceNodeParserService);
}());
//# sourceMappingURL=weightDeviceNodeParser.js.map