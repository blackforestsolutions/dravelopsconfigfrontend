sap.ui.define([
	"sap/ui/test/Opa5"
], function(Opa5) {
	"use strict";

	return Opa5.extend("de.blackforestsolutions.dravelopsconfigfrontend.test.integration.arrangements.Startup", {

		iStartMyApp: function () {
			this.iStartMyUIComponent({
				componentConfig: {
					name: "de.blackforestsolutions.dravelopsconfigfrontend",
					async: true,
					manifest: true
				}
			});
		}

	});
});
