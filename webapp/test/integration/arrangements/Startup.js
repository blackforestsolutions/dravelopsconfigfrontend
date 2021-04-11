sap.ui.define([
	"sap/ui/test/Opa5"
], function(Opa5) {
	"use strict";

	return Opa5.extend("de.blackforestdevs.dravelopsconfigfrontend.test.integration.arrangements.Startup", {

		iStartMyApp: function () {
			this.iStartMyUIComponent({
				componentConfig: {
					name: "de.blackforestdevs.dravelopsconfigfrontend",
					async: true,
					manifest: true
				}
			});
		}

	});
});
