(function () {
    'use strict';

    describe('opentele-commons.deviceListeners.weight', function() {

        var weightListener;

        beforeEach(module('opentele-commons.deviceListeners'));

        beforeEach(inject(function(_weightListener_) {
            weightListener = _weightListener_;
        }));

        it('should parse weight measurement event', function() {
            var weightEvent = {
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
                    "type": "weight",
                    "unit": "kg",
                    "value": 85.3
                }
            };
            var model = {};
            var eventListener = weightListener.create(model);

            eventListener(weightEvent);

            expect(model.deviceId).toEqual("foobar");
            expect(model.weight).toEqual(85.3);
        });
    });
}());
