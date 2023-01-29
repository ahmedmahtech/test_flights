sap.ui.define([
	"./AppController",
	"sap/ui/model/json/JSONModel"
], function (AppController, JSONModel) {
	"use strict";

	return AppController.extend("ahmed_practise.test_flights.controller.home", {
		onInit: function () {

			var oViewmodel, fnApnotbusy,
				iOrginalDelay = this.getView().getBusyIndicatorDelay();

			oViewmodel = new JSONModel({
				busy: true,
				delay: 0
			});
			this.setModel(oViewmodel, "homeView");
			fnApnotbusy = function () {
				oViewmodel.setProperty("/busy", false);
				oViewmodel.setProperty("/delay", iOrginalDelay);

			};
			this.getOwnerComponent().getModel().metadataLoaded().
			then(fnApnotbusy);
			this.getOwnerComponent().getModel().attachMetadataFailed(fnApnotbusy);
		}
	});
});