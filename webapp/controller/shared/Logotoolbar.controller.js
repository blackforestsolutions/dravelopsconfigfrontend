/**header toolbar for every page to get back to launchpad*/

sap.ui.define([
    "de/blackforestsolutions/dravelopsconfigfrontend/controller/BaseController"
], function (Basecontroller) {
    "use strict";
    return Basecontroller.extend("de.blackforestsolutions.dravelopsconfigfrontend.controller.shared.Logotoolbar", {
        onHomeIconPressed: function () {
            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("appLaunchpad", {}, true);
        }
    });
});
