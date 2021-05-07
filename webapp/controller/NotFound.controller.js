/**not found page is displayed when URL does not fit the provided once in Manifest.json -> routes* */

sap.ui.define([
    "de/blackforestsolutions/dravelopsconfigfrontend/controller/BaseController"
], function (BaseController) {
    "use strict";
    return BaseController.extend("de.blackforestsolutions.dravelopsconfigfrontend.controller.NotFound", {
        onInit: function () {
        }
    });
});
