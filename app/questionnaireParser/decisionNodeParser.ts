(function() {
    'use strict';

    let decisionNodeParser = angular.module('opentele-commons.questionnaireParser.decisionNodeParser', []);

    decisionNodeParser.service('decisionNodeParser', (nodesParser) => {

        let getOperator = (node) => {

            let operator;
            for (var op in node.expression) {
                operator = op;
                break;
            }

            if (operator !== 'lt' && operator !== 'gt' && operator !== 'eq') {
                throw new Error('Unsupported operator: ' + operator);
            }

            return operator;
        };

        let getValueAndType = (side, outputModel) => {

            let valueAndType;
            if (side.type === 'name') {
                valueAndType = {
                    value: outputModel[side.value].value,
                    type: outputModel[side.value].type
                };
            } else {
                valueAndType =  {
                    value: side.value,
                    type: side.type
                };
            }

            if (['Integer', 'Float', 'Boolean'].indexOf(valueAndType.type) < 0) {
                throw new Error('Type not supported: ' + valueAndType.type);
            }

            return valueAndType;
        };

        let evaluate = (operator, left, right) => {

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

        let parseNode = (node, nodeMap, outputModel) => {

            let operator = getOperator(node);
            let left = getValueAndType(node.expression[operator].left, outputModel);
            let right = getValueAndType(node.expression[operator].right, outputModel);
            let isTrue = evaluate(operator, left, right);
            let nextNodeId = isTrue === true ? node.next : node.nextFalse;

            return nodesParser.parse(nextNodeId, nodeMap, outputModel);
        };

        return parseNode;
    });
}());
