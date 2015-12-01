import { Representation } from 'parserTypes';

(function() {
    'use strict';

    let parserUtils = angular.module('opentele-commons.questionnaireParser.utils', []);

    parserUtils.service('parserUtils', ($templateCache) => {

        let getFirstKeyFromLiteral = (literal) => {
            for (let key in literal) {
                if (literal.hasOwnProperty(key)) {
                    return key;
                }
            }
        };

        let getNodeTemplate = (templateName : string) => {
            let template = $templateCache.get('questionnaireParser/nodeTemplates/' + templateName);
            if (typeof template === 'undefined') {
                throw new Error('HTML template does not exist for ' + templateName);
            }
            return template;
        };

        let getNodeType = (node) => getFirstKeyFromLiteral(node);

        let hashCode = (str : string) => {
            let hash = 0, i, chr, len;

            if (str.length === 0) {
                return hash;
            }

            for (i = 0, len = str.length; i < len; i++) {
                chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }

            return Math.abs(hash);
        };

        let replaceAll = (str, find, replace) => {
            let escapeRegExp = (str) => {
                return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
            };
            return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
        };

        let parseSimpleInputNode = (node, nodeValueEntry, fieldName) => {
            let isIntegerNode = nodeValueEntry.type === 'Integer';

            let template = getNodeTemplate('simpleInputNode.html');
            template = replaceAll(template, '#field_name#', fieldName);
            var numberPattern = isIntegerNode === true ? /^\d+$/ : /.+/;
            template = replaceAll(template, '#pattern#', numberPattern);

            let representation : Representation = {
                nodeTemplate: template,
                nodeModel: {
                    heading: node.text
                }
            };

            representation.rightButton = {
                text: "Next",
                nextNodeId: node.next,
                validate: (scope) => {
                    return scope.inputForm.value.$valid;
                },
                clickAction: (scope) => {
                    let nodeName = nodeValueEntry.name;
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

    });
}());
