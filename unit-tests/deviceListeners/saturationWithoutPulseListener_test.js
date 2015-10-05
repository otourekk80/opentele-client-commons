(function () {
    'use strict';

    describe('opentele-commons.deviceListeners.saturation', function() {

        var saturationWithOutPulseListener;
        var ignorePulse = false;

        beforeEach(module('opentele-commons.deviceListeners'));

        beforeEach(inject(function(_saturationWithoutPulseListener_) {
            saturationWithOutPulseListener = _saturationWithoutPulseListener_;
        }));

        it('should parse saturation measurement event', function() {
            var saturationEvent = {
                "timestamp": "2015-05-11T12:31:17.000+02:00",
                "device": {
                    "systemId": "abcd-1234",
                    "serialNumber": "1234-555",
                    "manufacturer": "ACME Inc",
                    "firmwareRevision": "5-t",
                    "eui64": "1234567890",
                    "model": "ABC-1234"
                },
                "type": "measurement",
                "measurement": {
                    "type": "saturation",
                    "unit": "%",
                    "value": 98
                }
            };
            var model = {};
            var eventListener = saturationWithOutPulseListener.create(model, ignorePulse);

            eventListener(saturationEvent);

            expect(model.deviceId).toEqual("abcd-1234");
            expect(model.saturation).toEqual(98);
        });

        it('should ignore pulse measurement event if flag is set', function() {
            var pulseEvent = {
                "timestamp": "2015-05-11T12:31:19.000+02:00",
                "device": {
                    "systemId": "abcd-1234",
                    "serialNumber": "1234-555",
                    "manufacturer": "ACME Inc",
                    "firmwareRevision": "5-t",
                    "eui64": "1234567890",
                    "model": "ABC-1234"
                },
                "type": "measurement",
                "measurement": {
                    "type": "pulse",
                    "unit": "bpm",
                    "value": 80
                }
            };
            var model = {};
            var eventListener = saturationWithOutPulseListener.create(model, true);

            eventListener(pulseEvent);

            expect(model.deviceId).toEqual("abcd-1234");
            expect(model.pulse).toEqual(undefined);
        });

    });
}());
