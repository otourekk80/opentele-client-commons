(function () {
    'use strict';

    describe('opentele-commons.deviceListeners.bloodPressure', function() {

        var bloodPressureListener;

        beforeEach(module('opentele-commons.deviceListeners'));

        beforeEach(inject(function(_bloodPressureListener_) {
            bloodPressureListener = _bloodPressureListener_;
        }));

        it('should parse blood pressure measurement event', function() {
            var bloodPressureEvent = {
                "timestamp": "2015-05-11T12:31:17.000+02:00",
                "device": {
                    "systemId": "32",
                    "serialNumber": "1234-555",
                    "manufacturer": "ACME Inc",
                    "firmwareRevision": "5-t",
                    "eui64": "1234567890",
                    "model": "ABC-1234"
                },
                "type": "measurement",
                "measurement": {
                    "type": "blood pressure",
                    "unit": "mmHg",
                    "value": {
                        "systolic": 122,
                        "diastolic": 95,
                        "meanArterialPressure": 108
                    }
                }
            };
            var model = {};
            var eventListener = bloodPressureListener.create(model);

            eventListener(bloodPressureEvent);

            expect(model.deviceId).toEqual("32");
            expect(model.systolic).toEqual(122);
            expect(model.diastolic).toEqual(95);
            expect(model.meanArterialPressure).toEqual(108);
        });

        it('should parse pulse measurement event', function() {
            var pulseEvent = {
                "timestamp": "2015-05-11T12:31:19.000+02:00",
                "device": {
                    "systemId": "42",
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
            var eventListener = bloodPressureListener.create(model);

            eventListener(pulseEvent);

            expect(model.deviceId).toEqual("42");
            expect(model.pulse).toEqual(80);
        });

    });
}());
