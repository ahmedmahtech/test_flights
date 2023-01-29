sap.ui.define([
	"sap/m/MessageToast",
	"sap/m/ViewSettingsItem",
	"sap/ui/core/CustomData",
	"sap/ui/core/Fragment",
	"./AppController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (MessageToast, ViewSettingsItem, CustomData, Fragment, AppController, JSONModel, Filter, FilterOperator) {
	"use strict";
	return AppController.extend("ahmed_practise.test_flights.controller.FlightsList", {
		onInit: function () {

			var oViewModel,
				iOriginalDelay,
				oTable = this.byId("table");
			iOriginalDelay = oTable.getBusyIndicatorDelay();
			this._aTableSearchState = [];
			this._mDialogs = {};
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "FlightslistView");
			oTable.attachEventOnce("updateFinished", function () {
				oViewModel.setProperty("/tableBusyDelay", iOriginalDelay);
			});

			this.addHistoryEntry({
				title: this.getResourceBundle().getText("worklistViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#test_flights-display"
			}, true);

		},

		_openDialog: function (sName, sPage, fInit) {
			var oView = this.getView();

			// creates requested dialog if not yet created
			if (!this._mDialogs[sName]) {
				this._mDialogs[sName] = Fragment.load({
					id: oView.getId(),
					name: "ahmed_practise.test_flights.Fragments." + sName,
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					if (fInit) {
						fInit(oDialog);
					}
					return oDialog;
				});
			}
			this._mDialogs[sName].then(function (oDialog) {
				// opens the requested dialog
				oDialog.open();
			});
		},
		// Opens View Settings Dialog
		handleOpenDialog: function () {
			this._openDialog("Dialog");
		},

		handleConfirm: function (oEvent) {
			var oView = this.getView(),
				oTable = oView.byId("table"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				aFilters = [],
				bDescending = mParams.sortDescending,
				sGroupBy,
				aSorters = [];

			if (mParams.filterString) {
				var filters = [];
				for (var key in mParams.filterKeys) {
					var filter = new sap.ui.model.Filter("carrid", sap.ui.model.FilterOperator.Contains, key);
					filters.push(filter);
				}

				oBinding.filter(filters);
			}
			if (mParams.sortItem.getKey() == "carrid") {
				sPath = mParams.sortItem.getKey();
				bDescending = mParams.sortDescending;
				aSorters.push(new sap.ui.model.Sorter("carrid", bDescending));
				oBinding.sort(aSorters);
			}

			if (mParams.groupItem) {
				sGroupBy = mParams.groupItem.getKey();
				aSorters.push(new sap.ui.model.Sorter(sGroupBy, mParams.groupDescending));
				oBinding.sort(aSorters);
				//oTable.setGroupHeaderSortProperty(sGroupBy);
				oBinding.groupBy(sGroupBy);
			}

		},
		onupdateFinished: function (oEvent) {

			var sTitle,
				oTable = oEvent.getSource(),
				iTableItems = oEvent.getParameter("total");

			if (iTableItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTableItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);

		},
		onPress: function (oEvent) {
			this._showObject(oEvent.getSource());
		},
		onSearch: function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				this.onRefresh();
			} else {
				var aTableSearchState = [];
				var sQuery = oEvent.getParameter("query");
				if (sQuery && sQuery.length > 0) {
					aTableSearchState = [new Filter("CARRNAME", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(aTableSearchState);
			}
		},
		onRefresh: function () {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		},
		_showObject: function (oItem) {
			this.getRouter().navTo("FlightObject", {
				objectId: oItem.getBindingContext().getProperty("carrid")
			});
		},
		_applySearch: function (aTableSearchState) {
			var oTable = this.byId("table"),
				oViewModel = this.getModel("FlightslistView");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		}

	});

});