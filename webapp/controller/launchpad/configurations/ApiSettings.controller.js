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
    let EDIT_FRAGMENT_NAME = "EditApiSettingsForm";
    let DISPLAY_FRAGMENT_NAME = "DisplayApiSettingsForm";
    let PATH_TO_VIEWS = "de.blackforestsolutions.dravelopsconfigfrontend.view.launchpad.configurations.";

    return BaseController.extend("de.blackforestsolutions.dravelopsconfigfrontend.controller.launchpad.configurations.ApiSettings", {

        onInit: function () {
            let oView = this.getView();
            oModelApiSettings.loadData(URL_GET);
            // oView.setBusy(true);
            oModelApiSettings.dataLoaded().then(() => {
                // oView.setBusy(false);
                oView.setModel(oModelApiSettings, "apisettings");
                // console.log(oModelApiSettings);
                console.log(oModelApiSettings.getData())
            })
            this._formFragments = {};

            // Set the initial form to be the display one
            this._showFormFragment(DISPLAY_FRAGMENT_NAME);

        },

        handleEditPress: function () {
            this._oApiSettings = Object.assign({}, oModelApiSettings.getData());
            this._toggleButtonsAndView(true);

        },

        handleCancelPress: function () {

            oModelApiSettings.loadData(URL_GET);
            oModelApiSettings.dataLoaded().then(() => {
                this.getView().setModel(oModelApiSettings, "apisettings");
            })
            this._toggleButtonsAndView(false);
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
                this._toggleButtonsAndView(false);
            }

        },

        _toggleButtonsAndView: function (bEdit) {
            var oView = this.getView();

            // Show the appropriate action buttons
            oView.byId("edit").setVisible(!bEdit);
            oView.byId("save").setVisible(bEdit);
            oView.byId("cancel").setVisible(bEdit);

            // Set the right form type
            this._showFormFragment(bEdit ? EDIT_FRAGMENT_NAME : DISPLAY_FRAGMENT_NAME);
        },

        _getFormFragment: function (sFragmentName) {
            var pFormFragment = this._formFragments[sFragmentName],
                oView = this.getView();

            if (!pFormFragment) {
                pFormFragment = Fragment.load({
                    id: oView.getId(),
                    name: PATH_TO_VIEWS + sFragmentName
                });
                this._formFragments[sFragmentName] = pFormFragment;
            }

            return pFormFragment;
        },

        _showFormFragment: function (sFragmentName) {
            var oPage = this.byId("page");

            oPage.removeAllContent();
            this._getFormFragment(sFragmentName).then(function (oVBox) {
                oPage.insertContent(oVBox);
            });
        },
    });
});
