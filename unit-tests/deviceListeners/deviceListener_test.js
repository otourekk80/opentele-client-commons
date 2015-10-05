(function () {
    'use strict';

    describe('opentele-commons.deviceListeners', function() {

        var deviceListener;
        var model = {};
        
        var handleEvent = function(event, measurementHandler) {
            if (measurementHandler === "undefined") {
                measurementHandler = function(model, event) {};
            }
            deviceListener.eventListener(model, event, measurementHandler)
        }

        beforeEach(module('opentele-commons.deviceListeners'));

        beforeEach(inject(function(_deviceListener_) {
            deviceListener = _deviceListener_;
        }));

        it('should parse connecting event', function() {
            var connectingEvent = {
                "timestamp": "2015-06-12T14:21:13.000+02:00",
                "type": "status",
                "status": {
                    "type": "info",
                    "message": "CONNECTING"
                }
            };
 
            handleEvent(connectingEvent);

            expect(model.info).toEqual("CONNECTING");
        });

        it('should parse connected event', function() {
            var connectedEvent = {
                "timestamp": "2015-06-12T17:33:14.000+02:00",
                "type": "status",
                "status": {
                    "type": "info",
                    "message": "CONNECTED"
                }
            };

            handleEvent(connectedEvent);

            expect(model.info).toEqual("CONNECTED");
        });

        it('should parse error event', function() {
            var errorEvent = {
                "timestamp": "2015-06-13T03:12:54.000+02:00",
                "type": "status",
                "status": {
                    "type": "error",
                    "message": "TEMPORARY_PROBLEM"
                }
            };

            handleEvent(errorEvent);

            expect(model.error).toEqual("TEMPORARY_PROBLEM");
        });

        it('should invoke passed measurement event handler', function() {
            var event = {
                "timestamp": "2015-05-11T12:33:07.000+02:00",
                "type": "measurement",
                "measurement": {
                    "type": "temperature",
                    "unit": "C",
                    "value": 37.3
                }
            };

            var actualEvent;
            handleEvent(event, function(model, passedEvent) {
                actualEvent = passedEvent;
            });

            expect(actualEvent).toBeDefined();
            expect(actualEvent).toEqual(event.measurement);
        });
        
        it ('should be possible to override status event handlers', function() {
            var event = {
                "timestamp": "2015-06-12T17:33:14.000+02:00",
                "type": "status",
                "status": {
                    "type": "info",
                    "message": "CONNECTED"
                }
            };
            
            var actualEvent;
            deviceListener.overrideStatusEventHandler('info', function(model, passedEvent) {
                actualEvent = passedEvent;
            })
            
            handleEvent(event);
            
            expect(actualEvent).toBeDefined();
            expect(actualEvent).toEqual(event.status);
        });
    });
}());
