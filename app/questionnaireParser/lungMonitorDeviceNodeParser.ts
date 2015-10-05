(function() {
    'use strict';

    let lungMonitorDeviceNodeParser = angular.module('opentele-commons.questionnaireParser.lungMonitorDeviceNodeParser', []);

    lungMonitorDeviceNodeParser.service('lungMonitorDeviceNodeParser', (parserUtils) => {
        let parseNode = (node) =>
            parserUtils.parseSimpleInputNode(node, node.fev1, 'LUNG_MONITOR');
        return parseNode;
    });

}());
