/**Launchpad is the main page of the application*/

sap.ui.define(
    [
        "sap/ui/model/json/JSONModel",
        "de/blackforestsolutions/dravelopsconfigfrontend/controller/BaseController"

    ],
    function (BaseController
        , JSONModel
    ) {
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
                    // const oRouter = this.getOwnerComponent().getRouter();
                    if (pressedTileId === apiSettingsTileId) {
                        this.logLoadedData();

                        // oRouter.navTo(routeApiSettingsTile, {}, true);
                    } else {
                        console.log("Routing to API Settings was not possible.");
                    }

                    /*pressedTileId === apiSettingsTileId
                        ? oRouter.navTo(routeApiSettingsTile, {}, true)
                        : console.log("Routing to API Settings was not possible.");*/
                },
                logLoadedData: async function () {
                    var oModel = new JSONModel();
                    var url = "http://localhost:8080/config_backend/apisettings";
                    $.get(url, function (response) {
                        console.log(response);
                        oModel.setData(response);
                    });
                },
            }
        );
    }
);
