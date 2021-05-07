/**Launchpad is the main page of the application*/

sap.ui.define(
    ["de/blackforestsolutions/dravelopsconfigfrontend/controller/BaseController"],
    function (BaseController) {
        "use strict";
        const apiSettingsTileId = "container-dravelopsconfigfrontend---launchpad--apiSettingsTile";
        const routeApiSettingsTile = "apisettings";
        return BaseController.extend(
            "de.blackforestsolutions.dravelopsconfigfrontend.controller.launchpad.Launchpad",
            {
                onInit: function () {
                },

                tileClicked(oEvent) {
                    const pressedTileId = oEvent.getSource().getId();
                    const oRouter = this.getOwnerComponent().getRouter();

                    pressedTileId === apiSettingsTileId
                        ? oRouter.navTo(routeApiSettingsTile, {}, true)
                        : console.log("Routing to API Settings was not possible.");
                }
            }
        );
    }
);
