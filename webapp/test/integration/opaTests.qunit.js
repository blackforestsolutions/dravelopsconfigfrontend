/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"de/blackforestdevs/dravelopsconfigfrontend/test/integration/AllJourneys"
	], function() {
		QUnit.start();
	});
});