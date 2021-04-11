sap.ui.define([
	"sap/ui/test/Opa5",
	"de/blackforestdevs/dravelopsconfigfrontend/test/integration/arrangements/Startup",
	"de/blackforestdevs/dravelopsconfigfrontend/test/integration/TodoListJourney",
	"de/blackforestdevs/dravelopsconfigfrontend/test/integration/SearchJourney",
	"de/blackforestdevs/dravelopsconfigfrontend/test/integration/FilterJourney"
], function(Opa5, Startup) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Startup(),
		pollingInterval: 1
	});

});
