(function () {
    'use strict';

    describe('opentele-commons.questionnaireParser', function () {
        var nodesParser, templateCache, nativeService, saturationListener, parsed;

        beforeEach(module('opentele-commons.questionnaireParser'));

        beforeEach(module(function($provide) {

            var nativeService = {
                addDeviceListener: function(measurementType, callbackName) {}
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

        describe('can parse saturationWithoutPulseDeviceNode', function() {
            var nodeMap;

            beforeEach(function() {
                var node = {
                    "SaturationWithoutPulseDeviceNode":{
                        "nodeName":"319",
                        "next":"ANSEV_320_D319",
                        "nextFail":"AN_319_CANCEL",
                        "text":"Saturation",
                        "helpText":null,
                        "helpImage":null,
                        "saturation":{
                            "name":"319.SAT#SATURATION",
                            "type":"Integer"
                        },
                        "deviceId":{
                            "name":"319.SAT#DEVICE_ID",
                            "type":"String"
                        }
                    }
               };

                nodeMap = {'319': node};
            });

            it('should parse node', function() {
                spyOn(saturationListener, 'create');
                spyOn(nativeService, 'addDeviceListener');

                parsed = nodesParser.parse('319', nodeMap, {});

                expect(saturationListener.create).toHaveBeenCalled();
                expect(nativeService.addDeviceListener).toHaveBeenCalled();

                expect(parsed).toBeDefined();
                expect(parsed.nodeTemplate).toMatch(/fake template/);
                expect(parsed.nodeModel.heading).toBe('Saturation');
                expect(templateCache.get.mostRecentCall.args[0])
                    .toMatch(/saturationWithoutPulseDeviceNode.html/);
                expect(parsed.leftButton).toBeDefined();
                expect(parsed.rightButton).toBeDefined();
            });

            it('should setup right button with click action', function() {
                parsed = nodesParser.parse('319', nodeMap, {});

                var right = parsed.rightButton;
                expect(right.text).toBe('Next');
                expect(right.nextNodeId).toBe('ANSEV_320_D319');
                expect(right.validate).toBeDefined();
                expect(right.clickAction).toBeDefined();

                var scope = {
                    outputModel: {
                    },
                    nodeModel: {
                        deviceId: 32,
                        saturation: 98
                    }
                };

                right.clickAction(scope);

                var saturation = scope.outputModel["319.SAT#SATURATION"];
                expect(saturation.name).toBe("319.SAT#SATURATION");
                expect(saturation.type).toBe('Integer');
                expect(saturation.value).toBeDefined(98);

                var device = scope.outputModel['319.SAT#DEVICE_ID'];
                expect(device.name).toBe('319.SAT#DEVICE_ID');
                expect(device.type).toBe('String');
                expect(device.value).toBeDefined('32');
            });

            it('should setup left button', function() {
                parsed = nodesParser.parse('319', nodeMap, {});

                var left = parsed.leftButton;
                expect(left.text).toBe('Omit');
                expect(left.nextNodeId).toBe('AN_319_CANCEL');
            });
        });
    });
}());
