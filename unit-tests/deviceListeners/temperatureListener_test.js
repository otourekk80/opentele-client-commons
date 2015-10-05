(function () {
    'use strict';

    describe('opentele-commons.deviceListeners.temperature', function() {

        var temperatureListener;

        beforeEach(module('opentele-commons.deviceListeners'));

        beforeEach(inject(function(_temperatureListener_) {
            temperatureListener = _temperatureListener_;
        }));

        it('should parse temperature measurement event', function() {
            var temperatureEvent = {
                "timestamp": "2015-05-11T12:33:07.000+02:00",
                "device": {
                    "systemId": "foobar",
                    "serialNumber": "1234-555",
                    "manufacturer": "ACME Inc",
                    "firmwareRevision": "5-t",
                    "eui64": "1234567890",
                    "model": "ABC-1234"
                },
                "type": "measurement",
                "measurement": {
                    "type": "temperature",
                    "unit": "C",
                    "value": 37.3
                }
            };
            var model = {};
            var eventListener = temperatureListener.create(model);

            eventListener(temperatureEvent);

            expect(model.deviceId).toEqual("foobar");
            expect(model.temperature).toEqual(37.3);
        });

    });
}());
