sap.ui.define(
  [
    "sap/ui/Device",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
  ],
  function (Device, Controller, JSONModel) {
    "use strict";

    return Controller.extend(
      "de.blackforestdevs.dravelopsconfigfrontend.controller.App",
      {
        onInit: function () {
          this.getView().setModel(
            new JSONModel({
              isMobile: Device.browser.mobile,
            }),
            "view"
          );
        },
      }
    );
  }
);
