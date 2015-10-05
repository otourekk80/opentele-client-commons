(function() {
    'use strict';

    describe('opentele-commons.questionnaireParser.temperatureManualDeviceNodeParser', function () {
        var nodesParser, templateCache;

        beforeEach(module('opentele-commons.questionnaireParser'));

        beforeEach(inject(function ($templateCache, _nodesParser_) {
            templateCache = $templateCache;
            nodesParser = _nodesParser_;

            templateCache.get = jasmine.createSpy().andReturn("fake template");
        }));

        describe('can parse TemperatureManualDeviceNode', function() {
            var nodeMap;
            beforeEach(function() {
                var node = {
                    "TemperatureManualDeviceNode": {
                        "nodeName": "144",
                        "next": "ANSEV_143_D142",
                        "nextFail": "AN_142_CANCEL",
                        "text": "Mål din temperatur og indtast resultatet i feltet nedenfor",
                        "temperature": {
                            "name": "144.TEMPERATURE",
                            "type": "Float"
                        }
                    }
                };
                nodeMap = {'144': node};
            });

            it('should parse node', function() {
                var parsed = nodesParser.parse('144', nodeMap, {});

                expect(parsed).toBeDefined();
                expect(parsed.nodeTemplate).toMatch(/fake template/);
                expect(parsed.nodeModel.heading).toBe('Mål din temperatur og indtast resultatet i feltet nedenfor');
                expect(templateCache.get.mostRecentCall.args[0])
                    .toMatch(/temperatureManualDeviceNode.html/);
                expect(parsed.leftButton).toBeDefined();
                expect(parsed.rightButton).toBeDefined();
            });

            it('should setup right button with click action', function() {
                var parsed = nodesParser.parse('144', nodeMap, {});

                var right = parsed.rightButton;
                expect(right.text).toBe('Next');
                expect(right.nextNodeId).toBe('ANSEV_143_D142');
                expect(right.clickAction).toBeDefined();
                var scope =  {
                    outputModel: {
                    },
                    nodeModel: {
                        temperatureMeasurement: 37.5
                    }
                };

                right.clickAction(scope);

                var output = scope.outputModel['144.TEMPERATURE'];
                expect(output.name).toBe('144.TEMPERATURE');
                expect(output.type).toBe('Float');
                expect(output.value).toBeDefined();
                expect(output.value).toBe(37.5);
            });

            it('should setup left button', function() {
                var parsed = nodesParser.parse('144', nodeMap, {});

                var left = parsed.leftButton;
                expect(left.text).toBe('Omit');
                expect(left.nextNodeId).toBe('AN_142_CANCEL');
                expect(left.clickAction).not.toBeDefined();
            });
        });
    });
}());
