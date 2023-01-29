/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ahmed_practise/test_flights/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});