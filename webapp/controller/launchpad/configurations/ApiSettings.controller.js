/**the yaml can be read and edited here*/


sap.ui.define([
    "de/blackforestsolutions/dravelopsconfigfrontend/controller/BaseController"

], function (BaseController) {
    "use strict";

    var url = "http://localhost:8080/config_backend/apisettings";
    return BaseController.extend("de.blackforestsolutions.dravelopsconfigfrontend.controller.launchpad.configurations.ApiSettings", {
        getApiSettingsFromBackend: async () => {
            $.get(url, function (response) {
                console.log(response);// @will response ist das json

            });
        },

        onInit: function () {
            this.getApiSettingsFromBackend();
        }
    });
});
