sap.ui.define([
	"./AppController",
	"sap/ui/model/json/JSONModel",

], function (AppController, JSONModel) {
	"use strict";

	return AppController.extend("ahmed_practise.test_flights.controller.FlightObject", {

		onInit: function () {

			var oTable = this.byId("table"),
				iOriginalDelay = oTable.getBusyIndicatorDelay(),
				oViewModel = new JSONModel({
					delay: 0,
					busy: true,
					worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
					tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
					tableBusyDelay: 0
				});
				


			this.getRouter().getRoute("FlightObject").attachPatternMatched(this._onObjectMatched, this);
			iOriginalDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "FlightObjectView");
			oTable.attachEventOnce("updateFinished", function () {
				oViewModel.setProperty("/tableBusyDelay", iOriginalDelay);
			});
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				oViewModel.setProperty("/delay", iOriginalDelay);
			});

		},

		_onObjectMatched: function (oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("CarrierCollection", {
					carrid: sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		_bindView: function (sObjectPath) {
			var oViewModel = this.getModel("FlightObjectView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oDataModel.metadataLoaded().then(function () {
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},
		onupdateFinished: function (oEvent) {

			var sTitle,
				oTable = oEvent.getSource();
			sTitle = this.getResourceBundle().getText("worklistTableTitle");
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);

		},
		_onBindingChange: function () {
			var oView = this.getView(),
				oViewModel = this.getModel("FlightObjectView"),
				oElementBinding = oView.getElementBinding();
			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.carrid,
				sObjectName = oObject.CARRNAME;

			oViewModel.setProperty("/busy", false);
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("objectTitle") + " - " + sObjectName,
				icon: "sap-icon://enter-more",
				intent: "#test_flights-display&/CarrierCollection/" + sObjectId
			});

		}

	});

});