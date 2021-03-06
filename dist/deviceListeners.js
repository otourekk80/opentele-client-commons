(function () {
    'use strict';
    var bloodPressureListener = angular.module('opentele-commons.deviceListeners.bloodPressure', [
        'opentele-commons.deviceListeners'
    ]);
    bloodPressureListener.service('bloodPressureListener', ["listenerConstants", "deviceListener", function (listenerConstants, deviceListener) {
        var BLOOD_PRESSURE = "blood pressure";
        var PULSE = "pulse";
        var handleMeasurementEvent = function (model, event) {
            var type = event.type;
            switch (type) {
                case BLOOD_PRESSURE:
                    var bloodPressureEvent = event;
                    var bloodPressure = bloodPressureEvent.value;
                    model.systolic = bloodPressure.systolic;
                    model.diastolic = bloodPressure.diastolic;
                    model.meanArterialPressure = event.value.meanArterialPressure;
                    break;
                case PULSE:
                    var pulseEvent = event;
                    var pulse = pulseEvent.value;
                    model.pulse = pulse;
                    break;
                default:
                    throw new TypeError("Unknown measurement event type received: " + type);
            }
        };
        var create = function (model) {
            return function (event) {
                deviceListener.eventListener(model, event, handleMeasurementEvent);
            };
        };
        return {
            create: create
        };
    }]);
}());
//# sourceMappingURL=bloodPressureListener.js.map
(function () {
    'use strict';
    var listeners = angular.module('opentele-commons.deviceListeners', [
        'opentele-commons.deviceListeners.bloodPressure',
        'opentele-commons.deviceListeners.saturation',
        'opentele-commons.deviceListeners.saturationWithoutPulse',
        'opentele-commons.deviceListeners.weight',
        'opentele-commons.deviceListeners.templates'
    ]);
    listeners.constant('listenerConstants', {
        MEASUREMENT: 'measurement',
        STATUS: 'status',
        INFO: 'info',
        ERROR: 'error',
        DEVICE: 'device'
    });
    listeners.service('deviceListener', ["listenerConstants", function (listenerConstants) {
        var statusEventHandlers = {};
        statusEventHandlers[listenerConstants.INFO] = function (model, event) {
            model.info = event.message;
        };
        statusEventHandlers[listenerConstants.ERROR] = function (model, event) {
            model.error = event.message;
        };
        var handleStatusEvent = function (model, event) {
            var type = event.type;
            if (!statusEventHandlers.hasOwnProperty(type)) {
                console.log("Unknown status type: " + type);
                return;
            }
            statusEventHandlers[type](model, event);
        };
        var eventListener = function (model, event, measurementHandler) {
            var type = event.type;
            if (event.hasOwnProperty(listenerConstants.DEVICE)) {
                var device = event.device;
                model.deviceId = device.systemId;
            }
            switch (type) {
                case listenerConstants.MEASUREMENT:
                    var measurementEvent = event[type];
                    measurementHandler(model, measurementEvent);
                    break;
                case listenerConstants.STATUS:
                    var statusEvent = event[type];
                    handleStatusEvent(model, statusEvent);
                    break;
                default:
                    console.log("Unknown event type: " + type);
                    break;
            }
        };
        var listener = {
            overrideStatusEventHandler: function (eventType, handler) {
                statusEventHandlers[eventType] = handler;
            },
            eventListener: eventListener
        };
        return listener;
    }]);
}());
//# sourceMappingURL=deviceListeners.js.map
//# sourceMappingURL=listenerTypes.js.map
(function () {
    'use strict';
    var saturationListener = angular.module('opentele-commons.deviceListeners.saturation', [
        'opentele-commons.deviceListeners'
    ]);
    saturationListener.service('saturationListener', ["listenerConstants", "deviceListener", function (listenerConstants, deviceListener) {
        var SATURATION = 'saturation';
        var PULSE = "pulse";
        var handleMeasurementEvent = function (model, event) {
            var type = event.type;
            switch (type) {
                case SATURATION:
                    var saturationEvent = event;
                    var saturation = saturationEvent.value;
                    model.saturation = saturation;
                    break;
                case PULSE:
                    var pulseEvent = event;
                    var pulse = pulseEvent.value;
                    model.pulse = pulse;
                    break;
                default:
                    console.log("Unknown measurement type: " + type);
                    break;
            }
        };
        var create = function (model) {
            return function (event) {
                deviceListener.eventListener(model, event, handleMeasurementEvent);
            };
        };
        return {
            create: create
        };
    }]);
}());
//# sourceMappingURL=saturationListener.js.map
(function () {
    'use strict';
    var saturationListener = angular.module('opentele-commons.deviceListeners.saturationWithoutPulse', [
        'opentele-commons.deviceListeners'
    ]);
    saturationListener.service('saturationWithoutPulseListener', ["listenerConstants", "deviceListener", function (listenerConstants, deviceListener) {
        var SATURATION = 'saturation';
        var PULSE = "pulse";
        var handleMeasurementEvent = function (model, event) {
            var type = event.type;
            switch (type) {
                case SATURATION:
                    var saturationEvent = event;
                    var saturation = saturationEvent.value;
                    model.saturation = saturation;
                    break;
                case PULSE:
                    break;
                default:
                    console.log("Unknown measurement type: " + type);
                    break;
            }
        };
        var create = function (model) {
            return function (event) {
                deviceListener.eventListener(model, event, handleMeasurementEvent);
            };
        };
        return {
            create: create
        };
    }]);
}());
//# sourceMappingURL=saturationWithoutPulseListener.js.map
angular.module('opentele-commons.deviceListeners.templates', ['deviceListeners/measurementTemplates/bloodPressure.html', 'deviceListeners/measurementTemplates/lungFunction.html', 'deviceListeners/measurementTemplates/saturation.html']);

angular.module("deviceListeners/measurementTemplates/bloodPressure.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("deviceListeners/measurementTemplates/bloodPressure.html",
    "<div class=\"center-div\">\n" +
    "    <h4 class=\"line-wrap\">{{ model.info | translate }}</h4>\n" +
    "</div>\n" +
    "<form name=\"bloodPressureForm\" class=\"text-center\">\n" +
    "    <fieldset class=\"questionnaire-fields\">\n" +
    "\n" +
    "        <div class=\"block\">\n" +
    "            <label for=\"blood-pressure-systolic\">\n" +
    "                {{ \"BLOOD_PRESSURE_SYSTOLIC\" | translate }}\n" +
    "            </label>\n" +
    "            <input id=\"blood-pressure-systolic\"\n" +
    "                   type=\"number\"\n" +
    "                   name=\"blood-pressure-systolic\"\n" +
    "                   ng-model=\"model.systolic\"\n" +
    "                   disabled />\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"block\">\n" +
    "            <label for=\"blood-pressure-diastolic\">\n" +
    "                {{ \"BLOOD_PRESSURE_DIASTOLIC\" | translate }}\n" +
    "            </label>\n" +
    "            <input id=\"blood-pressure-diastolic\"\n" +
    "                   type=\"number\"\n" +
    "                   name=\"blood-pressure-diastolic\"\n" +
    "                   ng-model=\"model.diastolic\"\n" +
    "                   disabled />\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"block\">\n" +
    "            <label for=\"blood-pressure-pulse\">\n" +
    "                {{ \"BLOOD_PRESSURE_PULSE\" | translate }}\n" +
    "            </label>\n" +
    "            <input id=\"blood-pressure-pulse\"\n" +
    "                   type=\"number\"\n" +
    "                   name=\"blood-pressure-pulse\"\n" +
    "                   ng-model=\"model.pulse\"\n" +
    "                   disabled />\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"block\"\n" +
    "             ng-show=\"model.error !== undefined\">\n" +
    "            <small class=\"error-message\">\n" +
    "                {{ model.error | translate }}\n" +
    "            </small>\n" +
    "        </div>\n" +
    "    </fieldset>\n" +
    "</form>\n" +
    "");
}]);

angular.module("deviceListeners/measurementTemplates/lungFunction.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("deviceListeners/measurementTemplates/lungFunction.html",
    "<div class=\"center-div\">\n" +
    "    <h4 class=\"line-wrap\">{{ model.info | translate }}</h4>\n" +
    "</div>\n" +
    "<form name=\"lungFunctionForm\" class=\"text-center\">\n" +
    "    <fieldset class=\"questionnaire-fields\">\n" +
    "\n" +
    "        <div class=\"block\">\n" +
    "            <label for=\"lung-function-fev1\">\n" +
    "                {{ \"LUNG_FUNCTION_FEV1\" | translate }}\n" +
    "            </label>\n" +
    "            <input id=\"lung-function-fev1\"\n" +
    "                   type=\"number\"\n" +
    "                   name=\"lung-function-fev1\"\n" +
    "                   ng-model=\"model.fev1\"\n" +
    "                   disabled />\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"block\"\n" +
    "             ng-show=\"model.error !== undefined\">\n" +
    "            <small class=\"error-message\">\n" +
    "                {{ model.error | translate }}\n" +
    "            </small>\n" +
    "        </div>\n" +
    "    </fieldset>\n" +
    "</form>\n" +
    "");
}]);

angular.module("deviceListeners/measurementTemplates/saturation.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("deviceListeners/measurementTemplates/saturation.html",
    "<div class=\"center-div\">\n" +
    "    <h4 class=\"line-wrap\">{{ model.info | translate }}</h4>\n" +
    "</div>\n" +
    "<form name=\"saturationForm\" class=\"text-center\">\n" +
    "    <fieldset class=\"questionnaire-fields\">\n" +
    "\n" +
    "        <div class=\"block\">\n" +
    "            <label for=\"saturation-saturation\">\n" +
    "                {{ \"SATURATION_SATURATION\" | translate }}\n" +
    "            </label>\n" +
    "            <input id=\"saturation-saturation\"\n" +
    "                   type=\"number\"\n" +
    "                   name=\"saturation-saturation\"\n" +
    "                   ng-model=\"model.saturation\"\n" +
    "                   disabled />\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"block\">\n" +
    "            <label for=\"saturation-pulse\">\n" +
    "                {{ \"SATURATION_PULSE\" | translate }}\n" +
    "            </label>\n" +
    "            <input id=\"saturation-pulse\"\n" +
    "                   type=\"number\"\n" +
    "                   name=\"saturation-pulse\"\n" +
    "                   ng-model=\"model.pulse\"\n" +
    "                   disabled />\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"block\"\n" +
    "             ng-show=\"model.error !== undefined\">\n" +
    "            <small class=\"error-message\">\n" +
    "                {{ model.error | translate }}\n" +
    "            </small>\n" +
    "        </div>\n" +
    "\n" +
    "    </fieldset>\n" +
    "</form>\n" +
    "");
}]);

(function () {
    'use strict';
    var weightListener = angular.module('opentele-commons.deviceListeners.weight', [
        'opentele-commons.deviceListeners'
    ]);
    weightListener.service('weightListener', ["listenerConstants", "deviceListener", function (listenerConstants, deviceListener) {
        var handleMeasurementEvent = function (model, event) {
            var weightEvent = event;
            var weight = weightEvent.value;
            model.weight = weight;
        };
        var create = function (model) {
            return function (event) {
                deviceListener.eventListener(model, event, handleMeasurementEvent);
            };
        };
        return {
            create: create
        };
    }]);
}());
//# sourceMappingURL=weightListener.js.map