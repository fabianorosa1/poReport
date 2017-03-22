"use strict";

module.exports = function(app,server) {
	 app.use("/poInit", require("./routes/poInit")());
};