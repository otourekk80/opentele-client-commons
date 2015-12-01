(function() {
    'use strict';

    describe('opentele-commons.nativeServices module', function() {
        var window, nativeService, questionnaireNamesToHighlight;

        beforeEach(module('opentele-commons.nativeServices'));
       
        describe('can publish and subscribe to messages from native layer', function() {
            beforeEach(inject(function(_nativeService_) {
                nativeService = _nativeService_;
            }));

            it('should be possible to subscribe to message', function() {
                var messageFromNative;
                nativeService.subscribeToSingleMessage("testmessage", function(message) {
                    messageFromNative = message;
                });
                
                nativeService.publishMessageFromNative({messageType: "testmessage", someProp: true});
                
                expect(messageFromNative).toBeDefined();
                expect(messageFromNative).toEqual({messageType: "testmessage", someProp: true});
            });
            
            it('should cancel single message subscription when message has been published', function() {
                var callbackInvoked = false;
                nativeService.subscribeToSingleMessage("testmessage", function(message) {
                    callbackInvoked = true;
                });
                
                nativeService.publishMessageFromNative({messageType: "testmessage", someProp: true});
                expect(callbackInvoked).toBeTruthy();
                callbackInvoked = false;
                
                nativeService.publishMessageFromNative({messageType: "testmessage", someProp: true});
                expect(callbackInvoked).toBeFalsy();                
            });
            
            it('should be possible to have multiple subscribers of message', function() {
                var callbackCount = 0;
                nativeService.subscribeToSingleMessage("testmessage", function(message) {
                    callbackCount++;
                });
                nativeService.subscribeToSingleMessage("testmessage", function(message) {
                    callbackCount++;
                });

                nativeService.publishMessageFromNative({messageType: "testmessage", someProp: true});

                expect(callbackCount).toBe(2);                
            });
            
            it('should be possible to subscribe to continous messages of same type', function() {
               var messageReceivedCount = 0;
               nativeService.subscribeToMultipleMessages("testmessage", function(message) {
                   messageReceivedCount++;
               });
               
                nativeService.publishMessageFromNative({messageType: "testmessage", someProp: true});
                nativeService.publishMessageFromNative({messageType: "testmessage", someProp: true});

                expect(messageReceivedCount).toBe(2);                
            });
            
            it('should be possible to unsubscribe single subscriber from message type', function() {
                var firstHandlerCalled = false;
                var secondHandlerCalled = false;
                nativeService.subscribeToMultipleMessages("testmessage", function(message) {
                    firstHandlerCalled = true;
                });
                var callback = function(message) {
                    secondHandlerCalled = true;
                };
                nativeService.subscribeToMultipleMessages("testmessage", callback);
               
                nativeService.unsubscribe("testmessage", callback);
                nativeService.publishMessageFromNative({messageType: "testmessage", someProp: true});

                expect(firstHandlerCalled).toBeTruthy();
                expect(secondHandlerCalled).toBeFalsy();                
            });
            
            it('should be possible to unsubscribe all subscribers from specific message type', function() {
                var firstHandlerCalled = false;
                var secondHandlerCalled = false;
                nativeService.subscribeToMultipleMessages("testmessage", function(message) {
                    firstHandlerCalled = true;
                });
                nativeService.subscribeToMultipleMessages("testmessage", function(message) {
                    secondHandlerCalled = true;
                });
               
                nativeService.unsubscribeAll("testmessage");
                nativeService.publishMessageFromNative({messageType: "testmessage", someProp: true});

                expect(firstHandlerCalled).toBeFalsy();
                expect(secondHandlerCalled).toBeFalsy();               
            });
        });

        describe('when there exists a native layer', function() {

            beforeEach(module(function($provide) {
                questionnaireNamesToHighlight = ["Blodsukker (manuel)", "Proteinindhold i urin"];
                var sendMessageToNative = function(message) {
                    switch (message.messageType) {
                        case "patientPrivacyPolicyRequest":
                            nativeService.publishMessageFromNative({messageType: "patientPrivacyPolicyResponse", text: "This is a privacy policy"});
                            break;
                        case "deviceInformationRequest":
                            nativeService.publishMessageFromNative({messageType: "deviceInformationResponse", model: "Nexus 7", brand: "google"});
                            break;
                        case "videoEnabledRequest":
                            nativeService.publishMessageFromNative({messageType: "videoEnabledResponse", enabled: true});
                            break;            
                        case "overdueQuestionnairesRequest":
                            nativeService.publishMessageFromNative({messageType: "overdueQuestionnairesResponse", questionnaireNames: questionnaireNamesToHighlight});
                            break;
                    }
                };

                window = {
                    sendMessageToNative: sendMessageToNative
                };
                $provide.value('$window', window);

            }));
            
            beforeEach(inject(function(_nativeService_) {
                nativeService = _nativeService_;
            }));

            it('should return a patient privacy policy', function() {
                var privacyPolicy;
                nativeService.getPatientPrivacyPolicy(function(response) {
                    privacyPolicy = response.text;
                });
                expect(privacyPolicy).toEqual("This is a privacy policy");
            });

            it('should return a JSON representation of device information', function() {
                var deviceInformation;
                nativeService.getDeviceInformation(function(response) {
                    deviceInformation = response;
                });
                expect(deviceInformation.model).toEqual("Nexus 7");
                expect(deviceInformation.brand).toEqual("google");
            });
            
            it('should forward open url requests to native layer', function() {
                spyOn(window, "sendMessageToNative");
                
                var url = "http://www.google.dk";
                nativeService.openUrl(url);
                
                expect(window.sendMessageToNative).toHaveBeenCalledWith({messageType: 'openUrlRequest', url: url});
            });

            it('should send properly parsed reminders', function() {
                spyOn(window, "sendMessageToNative");
                
                nativeService.sendReminders(["Blodtryk","Saturation"]);
                
                expect(window.sendMessageToNative).toHaveBeenCalledWith({messageType: 'setupRemindersRequest', reminders: ["Blodtryk","Saturation"]});
            });

            it('should send questionnaire name as expected', function() {
                spyOn(window, "sendMessageToNative");

                nativeService.clearRemindersForQuestionnaire("Blodtryk");

                expect(window.sendMessageToNative).toHaveBeenCalledWith({messageType: 'clearQuestionnaireReminderRequest', questionnaireName: "Blodtryk"});
            });

            it('should return a JSON representation of questionnaires to highlight', function() {
                var questionnairesToHighlight;
                nativeService.getQuestionnairesToHighlight(function(response) {
                    questionnairesToHighlight = response.questionnaireNames;
                });
                
                expect(questionnairesToHighlight.length).toEqual(2);
                expect(questionnairesToHighlight[0]).toEqual("Blodsukker (manuel)");
                expect(questionnairesToHighlight[1]).toEqual("Proteinindhold i urin");
            });

            it('should correctly parse an empty questionnaires to highlight response', function() {
                questionnaireNamesToHighlight = [];
                
                var questionnairesToHighlight;
                nativeService.getQuestionnairesToHighlight(function(response) {
                    questionnairesToHighlight = response.questionnaireNames;
                });
                
                expect(questionnairesToHighlight.length).toEqual(0);
            });

            // Video
            it('should forward start notification sound requests to native layer', function() {
                spyOn(window, "sendMessageToNative");
                
                nativeService.playNotificationSound();
                
                expect(window.sendMessageToNative).toHaveBeenCalledWith({messageType: 'startNotificationSoundRequest'});
            });

            it('should forward stop notification sound requests to native layer', function() {
                spyOn(window, "sendMessageToNative");
                
                nativeService.stopNotificationSound();
                
                expect(window.sendMessageToNative).toHaveBeenCalledWith({messageType: 'stopNotificationSoundRequest'});
                
            });

            it('should return a boolean when checking if client is video enabled', function() {
                var clientIsVideoEnabled = false;
                
                nativeService.clientIsVideoEnabled(function(response) {
                    clientIsVideoEnabled = response.enabled;
                });
                
                expect(clientIsVideoEnabled).toEqual(true);
            });

            it('should correctly pass argument to joinConference method', function() {
                spyOn(window, "sendMessageToNative");
                
                var videoConference = {
                    username: "myUser",
                    roomKey: "237",
                    serviceUrl: "http://www.example.com/myVideoService"
                };
                nativeService.joinConference(videoConference);
                
                expect(window.sendMessageToNative).toHaveBeenCalledWith({
                    messageType: 'startVideoConferenceRequest', 
                    conferenceDetails: videoConference
                });
            });

            // Device listeners

            it('should send correct message to native layer when addDeviceListener is called', function() {
                spyOn(window, "sendMessageToNative");
                
                var measurementType = "blood pressure";
                nativeService.addDeviceListener(measurementType);
                
                expect(window.sendMessageToNative).toHaveBeenCalledWith({messageType: 'deviceMeasurementRequest', measurementType: measurementType});
            });

            it('should send correct message to native layer when removeDeviceListeners is called', function() {
                spyOn(window, "sendMessageToNative");
                
                nativeService.removeDeviceListeners();

                expect(window.sendMessageToNative).toHaveBeenCalledWith({messageType: 'stopDeviceMeasurementRequest'});
            });
            
            it('should unsubscribe to measurement response messages from native layer when removeDeviceListeners is called', function() {
                var subscriptionNotCancelled = false;
                nativeService.subscribeToMultipleMessages("deviceMeasurementResponse", function() {
                    subscriptionNotCancelled = true;
                });                
                
                nativeService.removeDeviceListeners();
                nativeService.publishMessageFromNative({messageType: "deviceMeasurementResponse"});
                
                expect(subscriptionNotCancelled).toBeFalsy();
            });
        });

        describe('when no native layer exists', function() {

            beforeEach(module(function($provide) {

                window = {};
                $provide.value('$window', window);

            }));

            beforeEach(inject(function(_nativeService_) {
                nativeService = _nativeService_;
            }));

            it('should return proper defaults', function() {
                expect(function() {nativeService.getPatientPrivacyPolicy();}).not.toThrow();
                expect(function() {nativeService.getDeviceInformation();}).not.toThrow();

                expect(function() {nativeService.sendReminders();}).not.toThrow();
                
                expect(function() {nativeService.clearRemindersForQuestionnaire();}).not.toThrow();
                
                expect(function() {nativeService.getQuestionnairesToHighlight();}).not.toThrow();

                expect(function() {nativeService.clientIsVideoEnabled();}).not.toThrow();

                expect(function() {nativeService.joinConference({});}).not.toThrow();

                var callAddDeviceListener = function() {
                    nativeService.addDeviceListener("saturation", "callback");
                };

                expect(callAddDeviceListener).toThrow(
                    new Error("Could not add device listener for saturation"));

                nativeService.removeDeviceListeners();

            });

        });

    });
}());