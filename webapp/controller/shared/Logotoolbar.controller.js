/**header toolbar for every page to get back to launchpad*/

sap.ui.define([
    "de/blackforestsolutions/dravelopsconfigfrontend/controller/BaseController",
    "sap/ui/Device",
    'sap/ui/model/json/JSONModel',
    "sap/m/Button",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
], function (Basecontroller, JSONModel, Button, MessageToast, Fragment, Device) {
    "use strict";
    return Basecontroller.extend("de.blackforestsolutions.dravelopsconfigfrontend.controller.shared.Logotoolbar", {
        onInit: function () {
            var oModel = new JSONModel();
            var oView = this.getView();
            oModel.loadData("de/blackforestsolutions/dravelopsconfigfrontend/model/settings-model.json");
            // console.log(oModel);
            this.getView().setModel(oModel);

            if (!this._pPopover) {
                this._pPopover = Fragment.load({
                    id: oView.getId(),
                    name: "de.blackforestsolutions.dravelopsconfigfrontend.fragment.LogotoolbarSettings",
                    controller: this
                }).then(function (oPopover) {
                    oView.addDependent(oPopover);
                    if (Device.system.phone) {
                        oPopover.setEndButton(new Button({
                            text: "Close",
                            type: "Emphasized",
                            press: this.fnClose.bind(this)
                        }));
                    }
                    return oPopover;
                }.bind(this));
            }
        },

        onHomeIconPressed: function () {
            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("appLaunchpad", {}, true);
        },
        fnChange: function (oEvent) {
            MessageToast.show("Change event was fired from " + oEvent.getParameter("itemPressed").getId()
                + ". It has targetSrc: "
                + oEvent.getParameter("itemPressed").getTargetSrc()
                + " and target: "
                + oEvent.getParameter("itemPressed").getTarget()
                + ".");
        },
        fnOpen: function (oEvent) {
            var oButton = oEvent.getParameter("button");
            console.log(oButton);
            this._pPopover.then(function (oPopover) {
                oPopover.openBy(oButton);
            });
        },
        fnClose: function () {
            this._pPopover.then(function (oPopover) {
                oPopover.close();
            });
        }
    });
});
