(function () {
    'use strict';

    describe('opentele-commons.questionnaireParser.bloodPressureDeviceNodeParser', function () {
        var nodesParser, templateCache, nativeService, bloodPressureListener, parsed;

        beforeEach(module('opentele-commons.questionnaireParser'));

        beforeEach(module(function($provide) {

            var nativeService = {
                addDeviceListener: function(measurementType) {},
                subscribeToMultipleMessages: function(messageType, callback) {}
            };
            $provide.value('nativeService', nativeService);

            var bloodPressureListener = {
                create: function(model) {
                    return function(event) {};
                }
            };
            $provide.value('bloodPressureListener', bloodPressureListener);
        }));

        beforeEach(inject(function ($templateCache, _nativeService_,
                                    _bloodPressureListener_, _nodesParser_) {
            templateCache = $templateCache;
            nativeService = _nativeService_;
            bloodPressureListener = _bloodPressureListener_;
            nodesParser = _nodesParser_;

            templateCache.get = jasmine.createSpy().andReturn("fake template");
        }));

        describe('can parse bloodPressureDeviceNode', function() {
            var nodeMap;

            beforeEach(function() {
                var node = {
                    "BloodPressureDeviceNode": {
                        "deviceId": {
                            "type": "String",
                            "name": "106.BP#DEVICE_ID"
                        },
                        "pulse": {
                            "type": "Integer",
                            "name": "106.BP#PULSE"
                        },
                        "meanArterialPressure": {
                            "type": "Integer",
                            "name": "106.BP#MEAN_ARTERIAL_PRESSURE"
                        },
                        "systolic": {
                            "type": "Integer",
                            "name": "106.BP#SYSTOLIC"
                        },
                        "diastolic": {
                            "type": "Integer",
                            "name": "106.BP#DIASTOLIC"
                        },
                        "helpImage": null,
                        "helpText": null,
                        "text": "Blodtryk",
                        "nextFail": "AN_106_CANCEL",
                        "next": "ANSEV_108_D106",
                        "nodeName": "106"
                    }
                };

                nodeMap = {'106': node};
            });

            it('should parse node', function() {
                spyOn(bloodPressureListener, 'create');
                spyOn(nativeService, 'addDeviceListener');

                parsed = nodesParser.parse('106', nodeMap, {});

                expect(bloodPressureListener.create).toHaveBeenCalled();
                expect(nativeService.addDeviceListener).toHaveBeenCalled();

                expect(parsed).toBeDefined();
                expect(parsed.nodeTemplate).toMatch(/fake template/);
                expect(parsed.nodeModel.heading).toBe('Blodtryk');
                expect(templateCache.get.mostRecentCall.args[0])
                    .toMatch(/bloodPressureDeviceNode.html/);
                expect(parsed.leftButton).toBeDefined();
                expect(parsed.rightButton).toBeDefined();
            });

            it('should setup right button with click action', function() {
                parsed = nodesParser.parse('106', nodeMap, {});

                var right = parsed.rightButton;
                expect(right.text).toBe('Next');
                expect(right.nextNodeId).toBe('ANSEV_108_D106');
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
                    systolic: 122,
                    diastolic: 95,
                    meanArterialPressure: 108,
                    pulse: 80
                };

                expect(right.validate(scope)).toBe(true);

                right.clickAction(scope);

                var systolic = scope.outputModel["106.BP#SYSTOLIC"];
                expect(systolic.name).toBe("106.BP#SYSTOLIC");
                expect(systolic.type).toBe('Integer');
                expect(systolic.value).toBeDefined(122);

                var diastolic = scope.outputModel["106.BP#DIASTOLIC"];
                expect(diastolic.name).toBe("106.BP#DIASTOLIC");
                expect(diastolic.type).toBe('Integer');
                expect(diastolic.value).toBeDefined(95);

                var meanArterialPressure = scope.outputModel["106.BP#MEAN_ARTERIAL_PRESSURE"];
                expect(meanArterialPressure.name).toBe("106.BP#MEAN_ARTERIAL_PRESSURE");
                expect(meanArterialPressure.type).toBe('Integer');
                expect(meanArterialPressure.value).toBeDefined(108);

                var pulse = scope.outputModel["106.BP#PULSE"];
                expect(pulse.name).toBe("106.BP#PULSE");
                expect(pulse.type).toBe('Integer');
                expect(pulse.value).toBeDefined(80);

                var device = scope.outputModel['106.BP#DEVICE_ID'];
                expect(device.name).toBe('106.BP#DEVICE_ID');
                expect(device.type).toBe('String');
                expect(device.value).toBeDefined('32');
            });

            it('should setup left button', function() {
                parsed = nodesParser.parse('106', nodeMap, {});

                var left = parsed.leftButton;
                expect(left.text).toBe('Omit');
                expect(left.nextNodeId).toBe('AN_106_CANCEL');
            });
        });
    });
}());
