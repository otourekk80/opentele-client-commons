import {
    EventWrapper, MeasurementEvent, BloodPressureEvent, BloodPressure,
    PulseEvent, Pulse, DeviceEventHandler, DeviceListener
} from 'listenerTypes';

(function() {
    'use strict';

    let bloodPressureListener = angular.module('opentele-commons.deviceListeners.bloodPressure', [
        'opentele-commons.deviceListeners'
    ]);

    bloodPressureListener.service('bloodPressureListener', (listenerConstants, deviceListener : DeviceListener) => {

        const BLOOD_PRESSURE = "blood pressure";
        const PULSE = "pulse";

        let handleMeasurementEvent : DeviceEventHandler = (model, event : MeasurementEvent) => {
            let type = event.type;

            switch (type) {
            case BLOOD_PRESSURE:
                let bloodPressureEvent : BloodPressureEvent = event;
                let bloodPressure : BloodPressure = bloodPressureEvent.value;
                model.systolic = bloodPressure.systolic;
                model.diastolic = bloodPressure.diastolic;
                model.meanArterialPressure = event.value.meanArterialPressure;
                break;
            case PULSE:
                let pulseEvent : PulseEvent = event;
                let pulse : Pulse = pulseEvent.value;
                model.pulse = pulse;
                break;
            default:
                throw new TypeError(`Unknown measurement event type received: ${type}`);
            }
        };

        let create = (model) => {
            return (event : EventWrapper) => {
                deviceListener.eventListener(model, event, handleMeasurementEvent);
            };
        };

        return {
            create: create
        };

    });

}());
