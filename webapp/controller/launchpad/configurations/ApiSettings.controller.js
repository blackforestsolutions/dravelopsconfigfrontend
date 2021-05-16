/**the yaml can be read and edited here*/


sap.ui.define([
    "de/blackforestsolutions/dravelopsconfigfrontend/controller/BaseController",
    "sap/ui/model/json/JSONModel"

], function (BaseController, JSONModel) {
    "use strict";

    var url = "http://localhost:8080/config_backend/apisettings";
    let oModelApiSettings;
    return BaseController.extend("de.blackforestsolutions.dravelopsconfigfrontend.controller.launchpad.configurations.ApiSettings", {

        onInit: function () {
            oModelApiSettings = new JSONModel();
            oModelApiSettings.loadData(url);
            oModelApiSettings.dataLoaded().then(() => {
                this.getView().setModel(oModelApiSettings, "apisettings");
                // console.log(oModelApiSettings);
                console.log(oModelApiSettings.getData())
            })

        }

    });
});
