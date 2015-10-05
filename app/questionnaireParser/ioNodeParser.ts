import { Representation, NodeModel, LeftButton, RightButton } from 'parserTypes';

(function() {
    'use strict';

    let ioNodeParser = angular.module('opentele-commons.questionnaireParser.ioNodeParser', []);

    ioNodeParser.service('ioNodeParser', ($templateCache, parserUtils) => {

        let parseNode = (node) => {

            let elementTemplates = [];
            let labels = [];
            let clickActions = [];
            let validateActions = [];
            let representation : Representation = {
                nodeModel: {}
            };

            let setupClickActions = (skipValidation, buttonRepresentation) => {

                if (skipValidation === true) {
                    return;
                }

                buttonRepresentation.clickAction = (scope) => {
                    for (let i = 0; i < clickActions.length; i++) {
                        clickActions[i](scope);
                    }
                };

                buttonRepresentation.validate = (scope) => {
                    for (let i = 0; i < clickActions.length; i++) {
                        if (validateActions[i](scope) === false) {
                            return false;
                        }
                    }
                    return true;
                };
            };

            let handleTextViewElement = (element, representation, elementIndex, allElements) => {
                labels.push(element.text);
            };

            let handleEditTextElement = (element, representation) => {
                let template = parserUtils.getNodeTemplate('ioNodeEditText.html');
                let elementType = element.outputVariable.type === 'String' ? 'text' : 'number';
                let editFieldName = 'input_' + elementType + '_' + parserUtils.hashCode(element.outputVariable.name);
                let formName = 'form_' + editFieldName;

                template = parserUtils.replaceAll(template, '#type#', element.outputVariable.type === 'String' ? 'text' : 'number');
                template = parserUtils.replaceAll(template, '#step#', element.outputVariable.type === 'Integer' ? '1' : 'any');
                template = parserUtils.replaceAll(template, '#form_name#', formName);
                template = parserUtils.replaceAll(template, '#input_name#', editFieldName);

                let labelText = labels.length > 0 ? labels.pop() : '';
                template = parserUtils.replaceAll(template, '#label#', labelText);

                elementTemplates.push(template);

                clickActions.push((scope) => {
                    let variableName = element.outputVariable.name;
                    scope.outputModel[variableName] = {
                        name: variableName,
                        value: scope.nodeModel[editFieldName],
                        type: element.outputVariable.type
                    };
                });

                validateActions.push((scope) => {
                    return scope[formName][editFieldName].$valid;
                });
            };

            let handleTwoButtonElement = (element, representation : Representation) => {

                let leftButton : LeftButton = {
                    text: element.leftText,
                    nextNodeId: element.leftNext
                };
                setupClickActions(element.leftSkipValidation, leftButton);
                representation.leftButton = leftButton;

                let rightButton : RightButton = {
                    text: element.rightText,
                    nextNodeId: element.rightNext
                };
                setupClickActions(element.rightSkipValidation, rightButton);
                representation.rightButton = rightButton;
            };

            let handleButtonElement = function(element, representation : Representation) {

                let buttonRepresentation = {
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

            let handleRadioButtonElement = (element, representation) => {

                let setValueAccordingToType = (value, type) => {
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

                let template = parserUtils.getNodeTemplate('ioNodeRadioButton.html');
                let radioButtonName = 'input_' + elementTemplates.length;
                let formName = 'form_' + radioButtonName;
                representation.nodeModel.radioItems = element.choices.map((choice) => {
                    return { label: choice.text, value: choice.value.value };
                });
                template = parserUtils.replaceAll(template, '#form_name#', formName);
                elementTemplates.push(template);

                clickActions.push((scope) => {

                    let variableName = element.outputVariable.name;
                    let value = setValueAccordingToType(
                        scope.nodeModel.radioSelected,
                        element.outputVariable.type);

                    scope.outputModel[variableName] = {
                        name: variableName,
                        value: value,
                        type: element.outputVariable.type
                    };
                });

                validateActions.push((scope) => scope[formName].$dirty);
            };

            let elementHandlers = {
                TextViewElement: (element, representation, elementIndex, allElements) => {
                    handleTextViewElement(element, representation, elementIndex, allElements);
                },
                EditTextElement: (element, representation) => {
                    handleEditTextElement(element, representation);
                },
                ButtonElement: (element, representation) => {
                    handleButtonElement(element, representation);
                },
                TwoButtonElement: (element, representation) => {
                    handleTwoButtonElement(element, representation);
                },
                RadioButtonElement: (element, representation) => {
                    handleRadioButtonElement(element, representation);
                },
                HelpTextElement: () => { /**/ }
            };

            for (let i = 0; i < node.elements.length; i++) {
                let element = node.elements[i];
                let elementName = parserUtils.getNodeType(element);
                let handler = elementHandlers[elementName];
                handler(element[elementName], representation, i, node.elements);
            }

            // All TextViewElement labels not matched to input field is set as heading.
            elementTemplates.unshift(labels.map((label) => {
                let template = parserUtils.getNodeTemplate('ioNodeText.html');
                return parserUtils.replaceAll(template, '#heading#', label);
            }));
            representation.nodeTemplate = elementTemplates.join('\n');

            return representation;
        };

        return parseNode;
    });

}());
