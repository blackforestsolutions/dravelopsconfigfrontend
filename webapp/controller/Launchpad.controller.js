/**
 * Launchpad is the main page of the application
 * */

sap.ui.define(
    ["de/blackforestsolutions/dravelopsconfigfrontend/controller/BaseController"],
    function (BaseController) {
        "use strict";
        const deploymentConfigurationTileId = "container-dravelopsconfigfrontend---launchpad--deploymentConfigurationTile";
        const routeDeploymentConfigurationTile = "deploymentconfiguration";
        return BaseController.extend(
            "de.blackforestsolutions.dravelopsconfigfrontend.controller.Launchpad",
            {
                onInit: function () {
                },

                tileClicked(oEvent) {
                    const pressedTileId = oEvent.getSource().getId();
                    const oRouter = this.getOwnerComponent().getRouter();

                    pressedTileId === deploymentConfigurationTileId
                        ? oRouter.navTo(routeDeploymentConfigurationTile, {}, true)
                        : console.log("Routing to deployment configuration was not possible.");
                }
            }
        );
    }
);
