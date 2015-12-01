(function () {
    'use strict';

    describe('opentele-commons.questionnaireParser', function () {
        var nodesParser, templateCache, nativeService, weightListener, parsed;

        beforeEach(module('opentele-commons.questionnaireParser'));

        beforeEach(module(function($provide) {

            var nativeService = {
                addDeviceListener: function(measurementType) {},
                subscribeToMultipleMessages: function(messageType, callback) {}
            };
            $provide.value('nativeService', nativeService);

            var weightListener = {
                create: function(model) {
                    return function(event) {};
                }
            };
            $provide.value('weightListener', weightListener);
        }));

        beforeEach(inject(function ($templateCache, _nodesParser_,
                                    _nativeService_, _weightListener_) {
            templateCache = $templateCache;
            nodesParser = _nodesParser_;
            nativeService = _nativeService_;
            weightListener = _weightListener_;

            templateCache.get = jasmine.createSpy().andReturn("fake template");
        }));

        describe('can parse weightDeviceNode', function() {
            var nodeMap;

            beforeEach(function() {
                var node = {
                    "WeightDeviceNode": {
                        "helpImage": null,
                        "helpText": null,
                        "deviceId": {
                            "type": "String",
                            "name": "279.WEIGHT#DEVICE_ID"
                        },
                        "weight": {
                            "type": "Float",
                            "name": "279.WEIGHT"
                        },
                        "text": "Tænd for vægten og afvent ny besked i skærmbillede",
                        "nextFail": "AN_279_CANCEL",
                        "next": "ANSEV_280_D279",
                        "nodeName": "279"
                    }
                };

                nodeMap = {'279': node};
            });

            it('should parse node', function() {
                spyOn(weightListener, 'create');
                spyOn(nativeService, 'addDeviceListener');

                parsed = nodesParser.parse('279', nodeMap, {});

                expect(weightListener.create).toHaveBeenCalled();
                expect(nativeService.addDeviceListener).toHaveBeenCalled();

                expect(parsed).toBeDefined();
                expect(parsed.nodeTemplate).toMatch(/fake template/);
                expect(parsed.nodeModel.heading).toBe('WEIGHT');
                expect(templateCache.get.mostRecentCall.args[0])
                    .toMatch(/weightDeviceNode.html/);
                expect(parsed.leftButton).toBeDefined();
                expect(parsed.rightButton).toBeDefined();
            });

            it('should setup right button with click action', function() {
                parsed = nodesParser.parse('279', nodeMap, {});

                var right = parsed.rightButton;
                expect(right.text).toBe('Next');
                expect(right.nextNodeId).toBe('ANSEV_280_D279');
                expect(right.validate).toBeDefined();
                expect(right.clickAction).toBeDefined();
                var scope = {
                    outputModel: {
                    },
                    nodeModel: {
                        weight: 85.3,
                        deviceId: 42
                    }
                };

                right.clickAction(scope);

                var weight = scope.outputModel['279.WEIGHT'];
                expect(weight.name).toBe('279.WEIGHT');
                expect(weight.type).toBe('Float');
                expect(weight.value).toBe(85.3);

                var device = scope.outputModel['279.WEIGHT#DEVICE_ID'];
                expect(device.name).toBe('279.WEIGHT#DEVICE_ID');
                expect(device.type).toBe('String');
                expect(device.value).toBeDefined('42');
            });

            it('should setup left button', function() {
                parsed = nodesParser.parse('279', nodeMap, {});

                var left = parsed.leftButton;
                expect(left.text).toBe('Omit');
                expect(left.nextNodeId).toBe('AN_279_CANCEL');
            });
        });
    });
}());
