(function() {
    'use strict';

    describe('opentele-commons.questionnaireParser.temperatureDeviceNodeParser', function () {
        var nodesParser, templateCache, nativeService, temperatureListener, parsed;

        beforeEach(module('opentele-commons.questionnaireParser'));

        beforeEach(module(function($provide) {

            var nativeService = {
                addDeviceListener: function(measurementType, callbackName) {}
            };
            $provide.value('nativeService', nativeService);

            var temperatureListener = {
                create: function(model) {
                    return function(event) {};
                }
            };
            $provide.value('temperatureListener', temperatureListener);
        }));

        beforeEach(inject(function ($templateCache, _nativeService_,
                                    _temperatureListener_, _nodesParser_) {
            templateCache = $templateCache;
            nativeService = _nativeService_;
            temperatureListener = _temperatureListener_;
            nodesParser = _nodesParser_;

            templateCache.get = jasmine.createSpy().andReturn("fake template");
        }));

        describe('can parse temperatureDeviceNode', function() {
            var nodeMap;

            beforeEach(function() {
                var node = {
                    "TemperatureDeviceNode": {
                        "nodeName": "144",
                        "next": "ANSEV_143_D142",
                        "nextFail": "AN_142_CANCEL",
                        "text": "Mål din temperatur",
                        "temperature": {
                            "name": "144.TEMPERATURE",
                            "type": "Float"
                        }
                    }
                };
                nodeMap = {'144': node};
            });

            it('should parse node', function() {
                spyOn(temperatureListener, 'create');
                spyOn(nativeService, 'addDeviceListener');

                var parsed = nodesParser.parse('144', nodeMap, {});

                expect(temperatureListener.create).toHaveBeenCalled();
                expect(nativeService.addDeviceListener).toHaveBeenCalled();

                expect(parsed).toBeDefined();
                expect(parsed.nodeTemplate).toMatch(/fake template/);
                expect(parsed.nodeModel.heading)
                    .toBe('TEMPERATURE');
                expect(templateCache.get.mostRecentCall.args[0])
                    .toMatch(/temperatureDeviceNode.html/);
                expect(parsed.leftButton).toBeDefined();
                expect(parsed.rightButton).toBeDefined();
            });

            it('should setup right button with click action', function() {
                var parsed = nodesParser.parse('144', nodeMap, {});

                var right = parsed.rightButton;
                expect(right.text).toBe('Next');
                expect(right.nextNodeId).toBe('ANSEV_143_D142');
                expect(right.validate).toBeDefined();
                expect(right.clickAction).toBeDefined();

                var scope =  {
                    outputModel: {
                    },
                    nodeModel: {
                    }
                };

                expect(right.validate(scope)).toBe(false);

                scope.nodeModel = {
                    temperature: 37.5
                };

                expect(right.validate(scope)).toBe(true);

                right.clickAction(scope);

                var temperature = scope.outputModel['144.TEMPERATURE'];
                expect(temperature.name).toBe('144.TEMPERATURE');
                expect(temperature.type).toBe('Float');
                expect(temperature.value).toBeDefined();
                expect(temperature.value).toBe(37.5);

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
