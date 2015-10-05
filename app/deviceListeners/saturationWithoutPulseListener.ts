import { EventWrapper, MeasurementEvent, DeviceEventHandler, DeviceListener, SaturationEvent, Saturation } from 'listenerTypes';

(function() {
    'use strict';

    let saturationListener = angular.module('opentele-commons.deviceListeners.saturationWithoutPulse', [
        'opentele-commons.deviceListeners'
    ]);

    saturationListener.service('saturationWithoutPulseListener', (listenerConstants, deviceListener : DeviceListener) => {

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
