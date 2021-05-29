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
    "sap/m/Text"
], function (BaseController, JSONModel, MessageToast, ValueState, Dialog, DialogType, Button, ButtonType, Text) {
    "use strict";

    const URL = "http://localhost:8092/configbackend";
    let oModelApiSettings = new JSONModel()
    const CONFIGURATION_MODEL = "configuration";
    let oView;

    return BaseController.extend("de.blackforestsolutions.dravelopsconfigfrontend.controller.launchpad.configurations.ApiSettings", {

        onInit: function () {
            oView = this.getView();
            this.getApiSettingsFromBackend(oView);

            // global configuration model for views and fragments
            let oModelConfiguration = new JSONModel({
                input: {
                    isGeneralInputEnabled: false,
                    isJourneyQueryInputEnabled: false,
                    isJourneySubscriptionInputEnabled: false,
                    isAdressAutocompletionInputEnabled: false,
                    isNearestAdressesInputEnabled: false,
                    isNearestStationsInputEnabled: false,
                    isAllStationsInputEnabled: false,
                    isOperatingAreaInputEnabled: false,
                }, page: {
                    backgroundDesign: "List"
                }
            });
            this.getView().setModel(oModelConfiguration, CONFIGURATION_MODEL);
        },

        // TODO test if when write, save, error, cancel still there
        /**retrieves current api settings from backend */
        getApiSettingsFromBackend: function (oView) {
            oModelApiSettings.loadData(URL);
            oModelApiSettings.dataLoaded().then(() => {
                oView.setModel(oModelApiSettings, "apisettings");
            })
        },

        handleEditPress: function (oEvent) {
            const pressedButtonId = this.getButtonId(oEvent);
            this._oApiSettings = Object.assign({}, oModelApiSettings.getData());
            this.toggleButtonsAndInputs(true, pressedButtonId);
        },

        handleCancelPress: function (oEvent) {
            const pressedButtonId = this.getButtonId(oEvent);
            oModelApiSettings.loadData(URL);
            oModelApiSettings.dataLoaded().then(() => {
                this.getView().setModel(oModelApiSettings, "apisettings");
            })
            this.toggleButtonsAndInputs(false, pressedButtonId);
        },

        getButtonId: function (oEvent) {
            return oEvent.getSource().getId().split("-").slice(-1);
        },

        /**sending updated CallStatus to backend*/
        handleSavePress: function (oEvent) {
            const pressedButtonId = this.getButtonId(oEvent);
            $.ajax({
                url: URL,
                type: "PUT",
                dataType: 'json',
                contentType: "application/json",
                data: oModelApiSettings.getJSON(),
                success: function (response) {
                    let responseModel = new JSONModel(response);
                    checkPutResponse(responseModel, pressedButtonId)
                },
                error: function (error) {
                    if (error !== undefined) {
                        sap.m.MessageToast.show("An error occurred", {
                            duration: 6000
                        });
                    } else {
                        MessageToast.show("Unknown error!");
                    }
                }
            })

            const checkPutResponse = (responseModel, pressedButtonId) => {
                this.checkPutResponse(responseModel, pressedButtonId);
            }
        },

        checkPutResponse: function (responseModel, pressedButtonId) {
            let callStatuses = responseModel.getProperty("/");
            let isFailed = true;
            let errorContent = "";

            for (let callStatusEntry = 0; callStatusEntry < callStatuses.length; callStatusEntry++) {
                if (callStatuses[callStatusEntry].status == "FAILED") {
                    isFailed = false;
                    if (callStatusEntry !== callStatuses.length - 1) {
                        switch (callStatuses[callStatusEntry].calledObject) {
                            case "NEAREST_ADDRESSES":
                                errorContent += "Nearest adress" + ", ";
                                break;
                            case "JOURNEY_QUERY":
                                errorContent += "Journey query" + ", ";
                                break;
                            case "ADDRESS_AUTOCOMPLETION":
                                errorContent += "Adress autocompletion" + ", ";
                                break;
                            case "NEAREST_STATIONS":
                                errorContent += "Nearest stations" + ", ";
                                break;
                        }
                    } else {
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
                                errorContent += "Nearest stations"
                                break;
                        }
                    }
                }
            }

            if (!isFailed) {
                if (!this.oErrorMessageDialog) {
                    this.oErrorMessageDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Error",
                        state: ValueState.Error,
                        content: new Text({text: "Please correct your input for " + errorContent}),
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
        },

        toggleButtonsAndInputs: function (isEdit, pressedButtonId) {
            var oView = this.getView();
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
            }

            // Show the appropriate action buttons
            if (pressedButtonId == "editGeneral" || pressedButtonId == "saveGeneral" || pressedButtonId == "cancelGeneral") {
                oView.byId("editGeneral").setVisible(!isEdit);
                oView.byId("saveGeneral").setVisible(isEdit);
                oView.byId("cancelGeneral").setVisible(isEdit);
                this.getView().getModel(CONFIGURATION_MODEL).setProperty("/input/isGeneralInputEnabled", isEdit);
            }

            if (pressedButtonId == "editJourneyQuery" || pressedButtonId == "saveJourneyQuery" || pressedButtonId == "cancelJourneyQuery") {
                oView.byId("editJourneyQuery").setVisible(!isEdit);
                oView.byId("saveJourneyQuery").setVisible(isEdit);
                oView.byId("cancelJourneyQuery").setVisible(isEdit);
                this.getView().getModel(CONFIGURATION_MODEL).setProperty("/input/isJourneyQueryInputEnabled", isEdit);
            }

            if (pressedButtonId == "editGeneralJourneySubscription" || pressedButtonId == "saveGeneralJourneySubscription" || pressedButtonId == "cancelGeneralJourneySubscription") {
                oView.byId("editGeneralJourneySubscription").setVisible(!isEdit);
                oView.byId("saveGeneralJourneySubscription").setVisible(isEdit);
                oView.byId("cancelGeneralJourneySubscription").setVisible(isEdit);

                this.getView().getModel(CONFIGURATION_MODEL).setProperty("/input/isJourneySubscriptionInputEnabled", isEdit);
            }

            if (pressedButtonId == "editAdressAutocompletion" || pressedButtonId == "saveAdressAutocompletion" || pressedButtonId == "cancelAdressAutocompletion") {
                oView.byId("editAdressAutocompletion").setVisible(!isEdit);
                oView.byId("saveAdressAutocompletion").setVisible(isEdit);
                oView.byId("cancelAdressAutocompletion").setVisible(isEdit);
                this.getView().getModel(CONFIGURATION_MODEL).setProperty("/input/isAdressAutocompletionInputEnabled", isEdit);
            }

            if (pressedButtonId == "editNearestAdresses" || pressedButtonId == "saveNearestAdresses" || pressedButtonId == "cancelNearestAdresses") {
                oView.byId("editNearestAdresses").setVisible(!isEdit);
                oView.byId("saveNearestAdresses").setVisible(isEdit);
                oView.byId("cancelNearestAdresses").setVisible(isEdit);
                this.getView().getModel(CONFIGURATION_MODEL).setProperty("/input/isNearestAdressesInputEnabled", isEdit);
            }

            if (pressedButtonId == "editNearestStations" || pressedButtonId == "saveNearestStations" || pressedButtonId == "cancelNearestStations") {
                oView.byId("editNearestStations").setVisible(!isEdit);
                oView.byId("saveNearestStations").setVisible(isEdit);
                oView.byId("cancelNearestStations").setVisible(isEdit);
                this.getView().getModel(CONFIGURATION_MODEL).setProperty("/input/isNearestStationsInputEnabled", isEdit);
            }

            if (pressedButtonId == "editNearestStations" || pressedButtonId == "saveNearestStations" || pressedButtonId == "cancelNearestStations") {
                oView.byId("editNearestStations").setVisible(!isEdit);
                oView.byId("saveNearestStations").setVisible(isEdit);
                oView.byId("cancelNearestStations").setVisible(isEdit);
                this.getView().getModel(CONFIGURATION_MODEL).setProperty("/input/isAllStationsInputEnabled", isEdit);
            }

            if (pressedButtonId == "editOperatingArea" || pressedButtonId == "saveOperatingArea" || pressedButtonId == "cancelOperatingArea") {
                oView.byId("editOperatingArea").setVisible(!isEdit);
                oView.byId("saveOperatingArea").setVisible(isEdit);
                oView.byId("cancelOperatingArea").setVisible(isEdit);
                this.getView().getModel(CONFIGURATION_MODEL).setProperty("/input/isOperatingAreaInputEnabled", isEdit);
            }
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

        handleSelectChange: function (oEvent) {
            const mode = oEvent.getParameter("selectedItem").getKey();

            this.byId("ProductList").setMode(mode);
        }

    });
});
