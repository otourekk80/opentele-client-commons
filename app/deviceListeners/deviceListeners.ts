import {
    EventWrapper, Device, Event, StatusEvent, MeasurementEvent,
    DeviceEventHandler, EventListener, DeviceListener
} from 'listenerTypes';

(function() {
    'use strict';

    let listeners = angular.module('opentele-commons.deviceListeners', [
        'opentele-commons.deviceListeners.templates',
        'opentele-commons.deviceListeners.bloodPressure',
        'opentele-commons.deviceListeners.weight',
        'opentele-commons.deviceListeners.temperature',
        'opentele-commons.deviceListeners.saturation',
        'opentele-commons.deviceListeners.saturationWithoutPulse'
    ]);

    listeners.constant('listenerConstants', {
        MEASUREMENT: 'measurement',
        STATUS: 'status',
        INFO: 'info',
        ERROR: 'error',
        DEVICE: 'device'
    });

    listeners.service('deviceListener', (listenerConstants) => {

        let statusEventHandlers = {};
        statusEventHandlers[listenerConstants.INFO] = (model, event) => {
            model.info = event.message;
        };
        statusEventHandlers[listenerConstants.ERROR] = (model, event) => {
            model.error = event.message;
        };

        let handleStatusEvent = (model, event) => {
            let type = event.type;
            if (!statusEventHandlers.hasOwnProperty(type)) {
                console.log("Unknown status type: " + type);
                return;
            }
            statusEventHandlers[type](model, event);
        };

        let eventListener : EventListener = (model, event : EventWrapper, measurementHandler: DeviceEventHandler) => {
            let type = event.type;

            if (event.hasOwnProperty(listenerConstants.DEVICE)) {
                let device : Device = event.device;
                model.deviceId = device.systemId;
            }

            switch (type) {
            case listenerConstants.MEASUREMENT:
                let measurementEvent : MeasurementEvent = event[type];
                measurementHandler(model, measurementEvent);
                break;
            case listenerConstants.STATUS:
                let statusEvent : StatusEvent = event[type];
                handleStatusEvent(model, statusEvent);
                break;
            default:
                console.log("Unknown event type: " + type);
                break;
            }

        };

        let listener : DeviceListener = {
            overrideStatusEventHandler: (eventType : string, handler : DeviceEventHandler) => {
                statusEventHandlers[eventType] = handler;
            },
            eventListener: eventListener
        };
        return listener;
    });
}());
