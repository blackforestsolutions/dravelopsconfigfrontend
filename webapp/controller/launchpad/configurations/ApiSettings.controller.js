/**the yaml can be read and edited here*/


sap.ui.define([
    "de/blackforestsolutions/dravelopsconfigfrontend/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',

], function (BaseController, JSONModel, Fragment) {
    "use strict";

    // TODO base url

    var URL_GET = "http://localhost:8081/config_backend/apisettings";
    var URL_UPDATE = "http://localhost:8081/config_backend/update";
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
            // var oData = this.getView().getModel().getData();

            this.toggleButtonsAndInputs(true);
        },

        handleCancelPress: function () {
            oModelApiSettings.loadData(URL_GET);
            oModelApiSettings.dataLoaded().then(() => {
                this.getView().setModel(oModelApiSettings, "apisettings");
            })
            this.toggleButtonsAndInputs(false);
        },

        handleSavePress: function () {

            /* TODO
                check input
                send json to backend - DONE
                wait for backend response - DONE
                if error
                    show error and not save
                if !error - DONE
                    save and go to display
                */

            // check input

            // send update to backend
            $.ajax({
                url: URL_UPDATE,
                type: "PUT",
                dataType: 'json',
                contentType: "application/json",
                data: oModelApiSettings.getJSON(),
                success: function (response) {
                    console.log(response)
                    toggle();
                },
                error: function (error) {
                    if (error !== undefined) {
                        /*var oErrorResponse = $.parseJSON(error.responseText);
                        sap.m.MessageToast.show(oErrorResponse.message, {
                            duration: 6000
                        });*/
                    } else {
                        sap.m.MessageToast.show("Unknown error!");
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
            oView.byId("edit").setVisible(!bEdit);
            oView.byId("save").setVisible(bEdit);
            oView.byId("cancel").setVisible(bEdit);

            // enable input
            this.getView().getModel("configuration").setProperty("/isInputEnabled", bEdit);
        },
    });
});
