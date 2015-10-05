import { EventWrapper, MeasurementEvent, WeightEvent, Weight, DeviceListener, DeviceEventHandler } from 'listenerTypes';

(function() {
    'use strict';

    let weightListener = angular.module('opentele-commons.deviceListeners.weight', [
        'opentele-commons.deviceListeners'
    ]);

    weightListener.service('weightListener', (listenerConstants, deviceListener : DeviceListener) => {

        let handleMeasurementEvent : DeviceEventHandler = (model, event : MeasurementEvent) => {
            let weightEvent : WeightEvent = event;
            let weight = weightEvent.value;
            model.weight = weight;
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
