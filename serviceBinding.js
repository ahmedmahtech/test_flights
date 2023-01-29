function initModel() {
	var sUrl = "/sap/opu/odata/iwfnd/RMTSAMPLEFLIGHT/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}