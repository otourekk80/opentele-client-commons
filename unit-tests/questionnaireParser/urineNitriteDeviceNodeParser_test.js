(function() {
    'use strict';

    describe('opentele-commons.questionnaireParser.urineNitriteDeviceNodeParser', function() {
        var templateCache, nodesParser, parserUtils, nodeMap, parseNode, node;

        beforeEach(module('opentele-commons.questionnaireParser'));

        beforeEach(inject(function($templateCache, _nodesParser_, _parserUtils_) {
            templateCache = $templateCache;
            nodesParser = _nodesParser_;
            parserUtils = _parserUtils_;

            templateCache.get = jasmine.createSpy().andReturn("fake template");

            node = {
                "NitriteUrineDeviceNode": {
                    "nodeName": "144",
                    "next": "ANSEV_112_D110",
                    "nextFail": "AN_110_CANCEL",
                    "text": "Indtast resultatet fra din urinundersøgelse\nNitrite",
                    "nitriteUrine": {
                        "name": "110.URINE_NITRITE",
                        "type": "Integer"
                    }
                }
            };
            nodeMap = {
                '144': node
            };

            parseNode = function() {
                return nodesParser.parse('144', nodeMap, {});
            };
        }));

        it('should parse node urine nitrite node', function() {
            var parsed = parseNode();

            expect(parsed).toBeDefined();
            expect(parsed.nodeTemplate).toMatch(/fake template/);
            expect(parsed.nodeModel.heading)
                .toMatch(/Indtast resultatet fra din urinundersøgelse/);
            expect(parsed.nodeModel.measurement).not.toBeDefined();
            expect(parsed.nodeModel.measurementSelections).toEqual([
                'URINE_LEVEL_NEGATIVE', 'URINE_LEVEL_POSITIVE'
            ]);
            expect(templateCache.get.mostRecentCall.args[0])
                .toMatch(/urineLevel.html/);
            expect(parsed.leftButton).toBeDefined();
            expect(parsed.rightButton).toBeDefined();
        });

        it('should assign to output model when right button clicked', function () {
            var parsed = parseNode();

            var right = parsed.rightButton;
            expect(right.text).toBe('Next');
            expect(right.nextNodeId).toBe(node.NitriteUrineDeviceNode.next);
            expect(right.clickAction).toBeDefined();

            var scope = {
                outputModel: {
                    '110.URINE_NITRITE': {}
                },
                nodeModel: {
                    measurement: 1
                }
            };

            right.clickAction(scope);

            var output = scope.outputModel['110.URINE_NITRITE'];
            expect(output.type).toBe('Integer');
            expect(output.value).toBe(1);
        });

        it('should have a cancel button setup', function () {
            var parsed = parseNode();

            var left = parsed.leftButton;
            expect(left.text).toBe('Omit');
            expect(left.nextNodeId).toBe(node.NitriteUrineDeviceNode.nextFail);
            expect(left.clickAction).not.toBeDefined();
        });
    });
}());
