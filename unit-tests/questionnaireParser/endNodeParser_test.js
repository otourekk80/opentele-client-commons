(function () {
    'use strict';

    describe('opentele-commons.questionnaireParser', function () {
        var nodesParser;

        beforeEach(module('opentele-commons.questionnaireParser'));

        beforeEach(inject(function (_nodesParser_) {
            nodesParser = _nodesParser_;
        }));

        describe('can parse EndNode', function () {
            it('should parse EndNode', function () {
                var node = { "EndNode": {
                    "nodeName": "159"
                }
                           };
                var nodeMap = {'159': node};

                var parsed = nodesParser.parse('159', nodeMap, {});

                expect(parsed).toBeDefined();
                expect(parsed.nodeId).toEqual("159");
            });
        });
    });
}());
