jQuery.sap.declare("poUI.Component");
sap.ui.getCore().loadLibrary("sap.ui.generic.app");
jQuery.sap.require("sap.ui.generic.app.AppComponent");

sap.ui.generic.app.AppComponent.extend("poUI.Component", {
	metadata: {
		"manifest": "json"
	}
});