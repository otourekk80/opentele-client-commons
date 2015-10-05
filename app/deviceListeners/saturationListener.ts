import {
    EventWrapper, MeasurementEvent, PulseEvent, Pulse, SaturationEvent,
    Saturation, DeviceEventHandler, DeviceListener
} from 'listenerTypes';

(function() {
    'use strict';

    let saturationListener = angular.module('opentele-commons.deviceListeners.saturation', [
        'opentele-commons.deviceListeners'
    ]);

    saturationListener.service('saturationListener', (listenerConstants, deviceListener : DeviceListener) => {

        const SATURATION = 'saturation';
        const PULSE = "pulse";

        let handleMeasurementEvent : DeviceEventHandler = (model, event : MeasurementEvent) => {
            let type = event.type;

            switch (type) {
            case SATURATION:
                let saturationEvent : SaturationEvent = event;
                let saturation : Saturation = saturationEvent.value;
                model.saturation = saturation;
                break;
            case PULSE:
                let pulseEvent : PulseEvent = event;
                let pulse : Pulse = pulseEvent.value;
                model.pulse = pulse;
                break;
            default:
                console.log("Unknown measurement type: " + type);
                break;
            }
        };

        let create = (model) => {
            return (event) => {
                deviceListener.eventListener(model, event, handleMeasurementEvent);
            };
        };

        return {
            create: create
        };

    });

}());
