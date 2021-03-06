/**BaseController contains functions which are use multiple times.e.g. onNavBack*/


sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"
], function (Controller, History, UIComponent) {
    "use strict";

    return Controller.extend("de.blackforestsolutions.dravelopsconfigfrontend.controller.BaseController", {

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        /**To get back to last viewed page*/
        onNavBack: function () {
            let oHistory, sPreviousHash;

            oHistory = History.getInstance();
            sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getRouter().navTo("appLaunchpad", {}, true);
            }
        },
        /**when upper right icon is pressed -> routed to Launchpad* */
        onHomeIconPressed: function () {
            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("appLaunchpad", {}, true);
        }

    });

});
