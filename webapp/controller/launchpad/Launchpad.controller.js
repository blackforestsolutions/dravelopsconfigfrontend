/**Launchpad is the main page of the application*/

sap.ui.define(
    ["de/blackforestsolutions/dravelopsconfigfrontend/controller/BaseController"

    ],
    function (BaseController
    ) {
        "use strict";
        const apiSettingsTileId = "container-dravelopsconfigfrontend---launchpad--apiSettingsTile";
        const routeApiSettingsTile = "apisettings";
        const errorMessage = "Routing to API Settings was not possible.";
        var url = "http://localhost:8080/config_backend/apisettings";
        return BaseController.extend(
            "de.blackforestsolutions.dravelopsconfigfrontend.controller.launchpad.Launchpad",
            {
                onInit: function () {
                },

                /*when tile is clicked on launchpad a request is sent to backend and user is routed to suitable view
                 * which is filled by backend response
                 * @param oEvent*/
                tileClicked(oEvent) {
                    const pressedTileId = oEvent.getSource().getId();
                    const oRouter = this.getOwnerComponent().getRouter();

                    if (pressedTileId === apiSettingsTileId) {
                        this.getApiSettingsFromBackendAndRouteToApiSettingsView().then(r => oRouter.navTo(routeApiSettingsTile, {}, true));
                    } else {
                        console.log(errorMessage);
                    }
                },
                getApiSettingsFromBackendAndRouteToApiSettingsView: async () => {
                    $.get(url, function (response) {
                        console.log(response);
                    });
                }
            }
        );
    }
);
