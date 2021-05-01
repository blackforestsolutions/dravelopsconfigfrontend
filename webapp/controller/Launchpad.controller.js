/**
 * Launchpad is the main page of the application
 * */


sap.ui.define([
    "de/blackforestsolutions/dravelopsconfigfrontend/controller/BaseController",

], function (BaseController) {
    "use strict";
    return BaseController.extend("de.blackforestsolutions.dravelopsconfigfrontend.controller.Launchpad", {
        tileClicked: function (oEvent) {
            // which button is clicked
            const tile = oEvent.getSource().getId();
            console.log(tile);
            console.log(this);
        }

    });
});