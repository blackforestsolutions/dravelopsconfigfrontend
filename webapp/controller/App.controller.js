/**
 * root controller
 * */

sap.ui.define(
    [
        "sap/ui/Device",
        "de/blackforestsolutions/dravelopsconfigfrontend/controller/BaseController"
    ],
    function (Device, BaseController) {
        "use strict";

        return BaseController.extend(
            "de.blackforestsolutions.dravelopsconfigfrontend.controller.App",
            {
                onInit: function () {

                }
            }
        );
    }
);
