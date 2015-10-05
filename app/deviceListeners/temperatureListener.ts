import { EventWrapper, DeviceListener, MeasurementEvent, DeviceEventHandler, TemperatureEvent, Temperature } from 'listenerTypes';

(function() {
    'use strict';

    let temperatureListener = angular.module('opentele-commons.deviceListeners.temperature', [
        'opentele-commons.deviceListeners'
    ]);

    temperatureListener.service('temperatureListener', (listenerConstants, deviceListener : DeviceListener) => {

        let handleMeasurementEvent : DeviceEventHandler = (model, event : MeasurementEvent) => {
            let temperatureEvent : TemperatureEvent = event;
            let temperature = temperatureEvent.value;
            model.temperature = temperature;
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
