(function () {
    'use strict';

    describe('opentele-commons.questionnaireParser.saturationDeviceNodeParser', function () {
        var nodesParser, templateCache, nativeService, saturationListener, parsed;

        beforeEach(module('opentele-commons.questionnaireParser'));

        beforeEach(module(function($provide) {

            var nativeService = {
                addDeviceListener: function(measurementType) {},
                subscribeToMultipleMessages: function(messageType, callback) {}
            };
            $provide.value('nativeService', nativeService);

            var saturationListener = {
                create: function(model, ignorePulse) {
                    return function(event) {};
                }
            };
            $provide.value('saturationListener', saturationListener);
        }));

        beforeEach(inject(function ($templateCache, _nativeService_,
                                    _saturationListener_, _nodesParser_) {
            templateCache = $templateCache;
            nativeService = _nativeService_;
            saturationListener = _saturationListener_;
            nodesParser = _nodesParser_;

            templateCache.get = jasmine.createSpy().andReturn("fake template");
        }));

        describe('can parse saturationDeviceNode', function() {
            var nodeMap;

            beforeEach(function() {
                var node = {
                    "SaturationDeviceNode": {
                        "saturation":{
                            "name":"313.SAT#SATURATION",
                            "type":"Integer"
                        },
                        "pulse":{
                            "name":"313.SAT#PULSE",
                            "type":"Integer"
                        },
                        "deviceId":{
                            "name":"313.SAT#DEVICE_ID",
                            "type":"String"
                        },
                        "nodeName":"313",
                        "next":"ANSEV_314_D313",
                        "nextFail":"AN_313_CANCEL",
                        "text":"Saturation",
                        "helpText":null,
                        "helpImage":null
                    }
                };

                nodeMap = {'313': node};
            });

            it('should parse node', function() {
                spyOn(saturationListener, 'create');
                spyOn(nativeService, 'addDeviceListener');

                parsed = nodesParser.parse('313', nodeMap, {});

                expect(saturationListener.create).toHaveBeenCalled();
                expect(nativeService.addDeviceListener).toHaveBeenCalled();

                expect(parsed).toBeDefined();
                expect(parsed.nodeTemplate).toMatch(/fake template/);
                expect(parsed.nodeModel.heading).toBe('Saturation');
                expect(templateCache.get.mostRecentCall.args[0])
                    .toMatch(/saturationDeviceNode.html/);
                expect(parsed.leftButton).toBeDefined();
                expect(parsed.rightButton).toBeDefined();
            });

            it('should setup right button with click action', function() {
                parsed = nodesParser.parse('313', nodeMap, {});

                var right = parsed.rightButton;
                expect(right.text).toBe('Next');
                expect(right.nextNodeId).toBe('ANSEV_314_D313');
                expect(right.validate).toBeDefined();
                expect(right.clickAction).toBeDefined();

                var scope = {
                    outputModel: {
                    },
                    nodeModel: {
                    }
                };

                expect(right.validate(scope)).toBe(false);

                scope.nodeModel = {
                    deviceId: 32,
                    saturation: 98,
                    pulse: 80
                };

                expect(right.validate(scope)).toBe(true);

                right.clickAction(scope);

                var saturation = scope.outputModel["313.SAT#SATURATION"];
                expect(saturation.name).toBe("313.SAT#SATURATION");
                expect(saturation.type).toBe('Integer');
                expect(saturation.value).toBeDefined(98);

                var pulse = scope.outputModel["313.SAT#PULSE"];
                expect(pulse.name).toBe("313.SAT#PULSE");
                expect(pulse.type).toBe('Integer');
                expect(pulse.value).toBeDefined(80);

                var device = scope.outputModel['313.SAT#DEVICE_ID'];
                expect(device.name).toBe('313.SAT#DEVICE_ID');
                expect(device.type).toBe('String');
                expect(device.value).toBeDefined('32');
            });

            it('should setup left button', function() {
                parsed = nodesParser.parse('313', nodeMap, {});

                var left = parsed.leftButton;
                expect(left.text).toBe('Omit');
                expect(left.nextNodeId).toBe('AN_313_CANCEL');
            });
        });
    });
}());
