(function() {
    'use strict';

    var nativeServices = angular.module('opentele-commons.nativeServices', []);

    nativeServices.service('nativeService', function($window, $timeout) {

        var enableMessagesFromNative = function() {
            $window.sendMessageToWebView = function(rawMessage) {
                console.log('message from native layer received: ' + rawMessage);
                var message = JSON.parse(rawMessage);
                var publishAndForceAngularDigestCycle = function(message) {
                    $timeout(function() {
                        publishMessageFromNative(message);
                    });
                };

                publishAndForceAngularDigestCycle(message);
            };
        };

        var subscriptions = {};
        var addSubscription = function(messageType, callback, autoUnregister) {
            if (!subscriptions.hasOwnProperty(messageType)) {
                subscriptions[messageType] = [];
            }
            subscriptions[messageType].push({ handleMessage: callback, autoUnregister: autoUnregister });
        };
        var subscribeToSingleMessage = function(messageType, callback) {
            addSubscription(messageType, callback, true);
        };

        var subscribeToMultipleMessages = function(messageType, callback) {
            addSubscription(messageType, callback, false);
        };

        var unsubscribe = function(messageType, callback) {
            if (subscriptions.hasOwnProperty(messageType)) {
                var remainingSubscriptions = [];
                angular.forEach(subscriptions[messageType], function(subscription) {
                    if (subscription.handleMessage !== callback) {
                        remainingSubscriptions.push(subscription);
                    }
                });
                subscriptions[messageType] = remainingSubscriptions;
            }
        };

        var unsubscribeAll = function(messageType) {
            if (subscriptions.hasOwnProperty(messageType)) {
                subscriptions[messageType] = [];
            }
        };

        var publishMessageFromNative = function(message) {
            if (!subscriptions.hasOwnProperty(message.messageType)) {
                console.log("No message handlers found to handle message from native layer: " + message.messageType);
            }
            var handlers = subscriptions[message.messageType];
            var handlersStillRegistered = [];
            angular.forEach(handlers, function(handler) {
                console.log("invoking handler for messageType: " + message.messageType);
                handler.handleMessage(message);
                if (handler.autoUnregister === false) {
                    handlersStillRegistered.push(handler);
                }
            });
            subscriptions[message.messageType] = handlersStillRegistered;
        };

        var exists = function(identifier) {
            return (identifier !== undefined && identifier !== null);
        };

        var nativeExists = function() {
            return exists($window.sendMessageToNative);
        };

        var openUrl = function(url) {
            if (!nativeExists()) {
                console.log("Url cannot be opened. No native layer");
                return;
            }

            var request = {
                messageType: 'openUrlRequest',
                url: url
            };
            $window.sendMessageToNative(request);
        };

        var getPatientPrivacyPolicy = function(callback) {
            if (!nativeExists()) {
                console.log("No patient privacy policy information found");
                return;
            }

            subscribeToSingleMessage('patientPrivacyPolicyResponse', callback);
            var request = {
                messageType: 'patientPrivacyPolicyRequest'
            };
            $window.sendMessageToNative(request);
        };

        var getDeviceInformation = function(callback) {
            if (!nativeExists()) {
                console.log("No device information found");
                return;
            }

            subscribeToSingleMessage('deviceInformationResponse', callback);
            var request = {
                messageType: 'deviceInformationRequest'
            };
            $window.sendMessageToNative(request);
        };

        var sendReminders = function(reminderList) {
            if (!nativeExists()) {
                console.log("Could not send reminders");
                return;
            }

            var request = {
                messageType: 'setupRemindersRequest',
                reminders: reminderList
            };
            $window.sendMessageToNative(request);
        };

        var clearRemindersForQuestionnaire = function(questionnaireName) {
            if (!nativeExists()) {
                console.log("Could not clear reminders for questionnaire");
                return;
            }

            var request = {
                messageType: 'clearQuestionnaireReminderRequest',
                questionnaireName: questionnaireName
            };
            $window.sendMessageToNative(request);
        };

        var getQuestionnairesToHighlight = function(callback) {
            if (!nativeExists()) {
                console.log("Could not get list of questionnaires to highlight");
                return;
            }

            subscribeToSingleMessage('overdueQuestionnairesResponse', callback);
            var request = {
                messageType: 'overdueQuestionnairesRequest'
            };
            $window.sendMessageToNative(request);
        };

        var clientIsVideoEnabled = function(callback) {
            if (!nativeExists()) {
                console.log("Video not enabled on client");
                return;
            }

            subscribeToSingleMessage('videoEnabledResponse', callback);
            var request = {
                messageType: 'videoEnabledRequest'
            };
            $window.sendMessageToNative(request);
        };

        var joinConference = function(conferenceDetails) {
            if (!nativeExists()) {
                console.log("Could not join conference");
                return;
            }

            var request = {
                messageType: 'startVideoConferenceRequest',
                conferenceDetails: conferenceDetails
            };
            $window.sendMessageToNative(request);
        };

        var playNotificationSound = function() {
            if (!nativeExists()) {
                console.log("Could not play notification sound");
                return;
            }

            var request = {
                messageType: 'startNotificationSoundRequest'
            };
            $window.sendMessageToNative(request);
        };

        var stopNotificationSound = function() {
            if (!nativeExists()) {
                console.log("Could not stop notification sound");
                return;
            }

            var request = {
                messageType: 'stopNotificationSoundRequest'
            };
            $window.sendMessageToNative(request);
        };

        var addDeviceListener = function(measurementType) {

            if (!nativeExists()) {
                var error = new Error("Could not add device listener for " + measurementType);
                error.code = 2; // TODO - we need to be able to import types other than interfaces (classes, enums)
                throw error;
            }

            var request = {
                messageType: "deviceMeasurementRequest",
                measurementType: measurementType
            };
            $window.sendMessageToNative(request);
        };

        var removeDeviceListeners = function() {

            if (!nativeExists()) {
                console.log("Could not remove device listeners");
                return;
            }

            var request = {
                messageType: "stopDeviceMeasurementRequest"
            };
            $window.sendMessageToNative(request);
            unsubscribeAll("deviceMeasurementResponse");
        };

        return {
            enableMessagesFromNative: enableMessagesFromNative,
            subscribeToSingleMessage: subscribeToSingleMessage,
            subscribeToMultipleMessages: subscribeToMultipleMessages,
            unsubscribe: unsubscribe,
            unsubscribeAll: unsubscribeAll,
            publishMessageFromNative: publishMessageFromNative,

            getPatientPrivacyPolicy: getPatientPrivacyPolicy,
            getDeviceInformation: getDeviceInformation,
            openUrl: openUrl,

            sendReminders: sendReminders,
            clearRemindersForQuestionnaire: clearRemindersForQuestionnaire,
            getQuestionnairesToHighlight: getQuestionnairesToHighlight,

            clientIsVideoEnabled: clientIsVideoEnabled,
            joinConference: joinConference,
            playNotificationSound: playNotificationSound,
            stopNotificationSound: stopNotificationSound,

            addDeviceListener: addDeviceListener,
            removeDeviceListeners: removeDeviceListeners
        };

    });

} ());