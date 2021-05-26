/**the yaml can be read and edited here*/


sap.ui.define([
    "de/blackforestsolutions/dravelopsconfigfrontend/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    'sap/m/MessageToast'
], function (BaseController, JSONModel, MessageToast) {
    "use strict";

    // TODO base url

    var URL_GET = "http://localhost:8092/configbackend";
    var URL_PUT = "http://localhost:8092/configbackend";
    let oModelApiSettings = new JSONModel()
    let oView;

    return BaseController.extend("de.blackforestsolutions.dravelopsconfigfrontend.controller.launchpad.configurations.ApiSettings", {

        onInit: function () {
            oView = this.getView();
            // getting data from backend
            this.getApiSettingsFromBackend(oView);

            // creating configurations for views and fragments
            var oViewModel = new JSONModel({isInputEnabled: false});
            this.getView().setModel(oViewModel, "configuration");
        },
        getApiSettingsFromBackend: function (oView) {
            oModelApiSettings.loadData(URL_GET);
            oModelApiSettings.dataLoaded().then(() => {
                oView.setModel(oModelApiSettings, "apisettings");
                console.log(oModelApiSettings.getData())
            })
        },

        handleEditPress: function () {
            this._oApiSettings = Object.assign({}, oModelApiSettings.getData());
            this.toggleButtonsAndInputs(true);
        },

        handleCancelPress: function () {
            oModelApiSettings.loadData(URL_GET);
            oModelApiSettings.dataLoaded().then(() => {
                this.getView().setModel(oModelApiSettings, "apisettings");
            })
            this.toggleButtonsAndInputs(false);
        },

        /**
         * sending updated CallStatus to backend
         * */
        handleSavePress: function () {

            $.ajax({
                url: URL_PUT,
                type: "PUT",
                dataType: 'json',
                contentType: "application/json",
                data: oModelApiSettings.getJSON(),
                success: function (response) {
                    var responseModel = new JSONModel(response);
                    if (responseModel.getProperty("/status")) {
                        let status = responseModel.getProperty("/status");
                        if (status === "SUCCESS") {
                            MessageToast.show("Saved successfully.");
                            toggle();
                        } else if (status === "FAILED") {
                            MessageToast.show("Please correct your input.");
                        }
                    }


                },
                error: function (error) {
                    if (error !== undefined) {
                        /*var oErrorResponse = $.parseJSON(error.responseText);
                        sap.m.MessageToast.show(oErrorResponse.message, {
                            duration: 6000
                        });*/
                    } else {
                        MessageToast.show("Unknown error!");
                    }
                }
            })

            const toggle = () => {
                this.toggleButtonsAndInputs(false);
            }

        },

        toggleButtonsAndInputs: function (bEdit) {
            var oView = this.getView();

            // Show the appropriate action buttons
            oView.byId("editGeneral").setVisible(!bEdit);
            oView.byId("editJourneyQuery").setVisible(!bEdit);
            oView.byId("editGeneralJourneySubsription").setVisible(!bEdit);
            oView.byId("editAdressAutocompletion").setVisible(!bEdit);
            oView.byId("editNearestAdresses").setVisible(!bEdit);
            oView.byId("editNearestStations").setVisible(!bEdit);
            oView.byId("editAllStations").setVisible(!bEdit);
            oView.byId("editOperatingArea").setVisible(!bEdit);

            oView.byId("saveGeneral").setVisible(bEdit);
            oView.byId("saveJourneyQuery").setVisible(bEdit);
            oView.byId("saveGeneralJourneySubsription").setVisible(bEdit);
            oView.byId("saveAdressAutocompletion").setVisible(bEdit);
            oView.byId("saveNearestAdresses").setVisible(bEdit);
            oView.byId("saveNearestStations").setVisible(bEdit);
            oView.byId("saveAllStations").setVisible(bEdit);
            oView.byId("saveOperatingArea").setVisible(bEdit);

            oView.byId("cancelGeneral").setVisible(bEdit);
            oView.byId("cancelJourneyQuery").setVisible(bEdit);
            oView.byId("cancelGeneralJourneySubsription").setVisible(bEdit);
            oView.byId("cancelAdressAutocompletion").setVisible(bEdit);
            oView.byId("cancelNearestAdresses").setVisible(bEdit);
            oView.byId("cancelNearestStations").setVisible(bEdit);
            oView.byId("cancelAllStations").setVisible(bEdit);
            oView.byId("cancelOperatingArea").setVisible(bEdit);

            // enable input
            this.getView().getModel("configuration").setProperty("/isInputEnabled", bEdit);
        },

        onListItemPress: function (oEvent) {
            var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();

            this.getSplitAppObj().toDetail(this.createId(sToPageId));
        },

        getSplitAppObj: function () {
            var result = this.byId("SplitAppDemo");
            if (!result) {
                Log.info("SplitApp object can't be found");
            }
            return result;
        }


    });
});
