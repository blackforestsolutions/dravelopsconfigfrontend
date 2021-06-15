/**the yaml can be read and edited here*/


sap.ui.define([
    "de/blackforestsolutions/dravelopsconfigfrontend/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    'sap/m/MessageToast',
    "sap/ui/core/ValueState",
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/Text",
    "sap/base/Log",
    'sap/ui/core/BusyIndicator'
], function (BaseController, JSONModel, MessageToast, ValueState, Dialog, DialogType, Button, ButtonType, Text, Log, BusyIndicator) {
    "use strict";

    const URL = "http://localhost:8092/configbackend";
    let oModelApiSettings = new JSONModel();
    const CONFIGURATION_MODEL = "configuration";
    let oView;
    const nameList = ["General", "JourneyQuery", "JourneySubscription", "AdressAutocompletion", "NearestAdresses", "NearestStations", "AllStations", "OperatingArea"];
    let oModelConfiguration;

    return BaseController.extend("de.blackforestsolutions.dravelopsconfigfrontend.controller.launchpad.configurations.ApiSettings", {

        onInit: function () {
            oView = this.getView();
            this.getRouter().getRoute('apisettings').attachMatched(this.onRouteMatched, this);

            // global configuration model for views and fragments
            oModelConfiguration = this.setInitialConfigurations();
            oView.setModel(oModelConfiguration, CONFIGURATION_MODEL);
        },

        setInitialConfigurations: function () {
            return new JSONModel({
                input: {
                    isGeneralInputEnabled: false,
                    isJourneyQueryInputEnabled: false,
                    isJourneySubscriptionInputEnabled: false,
                    isAdressAutocompletionInputEnabled: false,
                    isNearestAdressesInputEnabled: false,
                    isNearestStationsInputEnabled: false,
                    isAllStationsInputEnabled: false,
                    isOperatingAreaInputEnabled: false
                }, page: {
                    backgroundDesign: "List"
                }
            });
        },

        /**
         * Handle matched route and request current configuration from backend.
         */
        onRouteMatched: function () {
            oModelApiSettings.loadData(URL);
            oModelApiSettings.dataLoaded().then(() => {
                oView.setModel(oModelApiSettings, "apisettings");
            });
        },

        handleEditPress: function (oEvent) {
            const pressedButtonId = this.getButtonId(oEvent);
            this.toggleButtonsAndInputs(true, pressedButtonId);
        },

        handleCancelPress: function (oEvent) {
            const pressedButtonId = this.getButtonId(oEvent);
            oModelApiSettings.loadData(URL);
            oModelApiSettings.dataLoaded().then(() => {
                this.getView().setModel(oModelApiSettings, "apisettings");
            });
            this.toggleButtonsAndInputs(false, pressedButtonId);
        },

        getButtonId: function (oEvent) {
            return oEvent.getSource().getId().split("-").slice(-1);
        },

        // sending updated CallStatus to backend and verify response
        handleSavePress: function (oEvent) {
            const pressedButtonId = this.getButtonId(oEvent);

            const checkPutResponse = (responseModel, pressedButtonId) => {
                this.checkPutResponse(responseModel, pressedButtonId);
            };

            const hideBusyIndicator = () => {
                this.hideBusyIndicator();
            };

            this.showBusyIndicator();
            $.ajax({
                url: URL,
                type: "PUT",
                dataType: 'json',
                contentType: "application/json",
                data: oModelApiSettings.getJSON(),
                success: function (response) {
                    let responseModel = new JSONModel(response);
                    checkPutResponse(responseModel, pressedButtonId);
                },
                error: function (error) {
                    hideBusyIndicator();
                    if (error !== undefined) {
                        sap.m.MessageToast.show("An error occurred", {
                            duration: 6000
                        });
                    } else {
                        MessageToast.show("Unknown error!");
                    }
                }
            });
        },

        checkPutResponse: function (responseModel, pressedButtonId) {
            let callStatuses = responseModel.getProperty("/");
            let isFailed = true;
            let errorContent = "Please correct your input for ";
            let errorInResponse = false;
            for (let callStatusEntry = 0; callStatusEntry < callStatuses.length; callStatusEntry++) {
                if (callStatuses[callStatusEntry].status === "FAILED") {
                    isFailed = false;
                    switch (callStatuses[callStatusEntry].calledObject) {
                        case "NEAREST_ADDRESSES":
                            errorContent += "Nearest adress";
                            break;
                        case "JOURNEY_QUERY":
                            errorContent += "Journey query";
                            break;
                        case "ADDRESS_AUTOCOMPLETION":
                            errorContent += "Adress autocompletion";
                            break;
                        case "NEAREST_STATIONS":
                            errorContent += "Nearest stations";
                            break;
                        default:
                            errorInResponse = true;
                            break;
                    }
                    if (callStatusEntry !== callStatuses.length - 1) {
                        errorContent += ", ";
                    }
                }
            }

            if (errorInResponse) {
                errorContent = "Response could not be computed.";
            }

            if (!isFailed) {
                if (!this.oErrorMessageDialog) {
                    this.oErrorMessageDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Error",
                        state: ValueState.Error,
                        content: new Text({text: errorContent}),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "OK",
                            press: function () {
                                this.oErrorMessageDialog.close();
                            }.bind(this)
                        })
                    });
                }
                this.oErrorMessageDialog.open();
            } else {
                MessageToast.show("Saved successfully.");
                this.toggleButtonsAndInputs(false, pressedButtonId);

            }
            this.hideBusyIndicator();
        },

        toggleButtonsAndInputs: function (isEdit, pressedButtonIdArray) {
            let pressedButtonId = pressedButtonIdArray[0];
            if (isEdit) {
                this.byId("configurationTabs").getItems().forEach(function (item) {
                    item.setType("Inactive");
                });
                this.byId("configurationTabs").setMode("None");
            } else {
                this.byId("configurationTabs").getItems().forEach(function (item) {
                    item.setType("Active");
                });
                this.byId("configurationTabs").setMode("SingleSelectMaster");
                let list = this.byId("configurationTabs");
                for (let i = 0; i < nameList.length; i++) {
                    if (pressedButtonId.includes(nameList[i])) {
                        list.setSelectedItem(list.getItems()[i], true, true);
                    }
                }
            }

            for (let i = 0; i < nameList.length; i++) {
                if (pressedButtonId.includes(nameList[i])) {
                    this.toggleVisibilityAndEditability(nameList[i], isEdit);
                    break;
                }
            }
        },

        toggleVisibilityAndEditability: function (tabName, isEdit) {
            oView.byId("edit" + tabName).setVisible(!isEdit);
            oView.byId("save" + tabName).setVisible(isEdit);
            oView.byId("cancel" + tabName).setVisible(isEdit);
            this.getView().getModel(CONFIGURATION_MODEL).setProperty("/input/is" + tabName + "InputEnabled", isEdit);
        },

        onListItemPress: function (oEvent) {
            const sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();
            this.getSplitAppObj().toDetail(this.createId(sToPageId));
        },

        getSplitAppObj: function () {
            const result = this.byId("SplitAppDemo");
            if (!result) {
                Log.info("SplitApp object can't be found");
            }
            return result;
        },

        hideBusyIndicator: function () {
            BusyIndicator.hide();
        },

        showBusyIndicator: function () {
            BusyIndicator.show();
        }

    });
});
