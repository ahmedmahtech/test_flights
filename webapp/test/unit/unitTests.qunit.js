/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ahmed_practise/test_flights/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});