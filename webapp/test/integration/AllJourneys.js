sap.ui.define([
	"sap/ui/test/Opa5",
	"de/blackforestsolutions/dravelopsconfigfrontend/test/integration/arrangements/Startup",
	"de/blackforestsolutions/dravelopsconfigfrontend/test/integration/TodoListJourney",
	"de/blackforestsolutions/dravelopsconfigfrontend/test/integration/SearchJourney",
	"de/blackforestsolutions/dravelopsconfigfrontend/test/integration/FilterJourney"
], function(Opa5, Startup) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Startup(),
		pollingInterval: 1
	});

});
