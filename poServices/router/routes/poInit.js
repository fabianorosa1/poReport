/*eslint no-console: 0, no-unused-vars: 0, no-undef:0, new-cap:0, no-shadow:0 */
/*eslint-env node, es6 */
"use strict";
var express = require("express");
var async = require("async");

module.exports = () => {
	var app = express.Router();

	//Hello Router
	app.get("/", (req, res) => {
		res.type("text/html").status(200).send("PO Test Initialization Service");
	});

	app.get("/Create/:Number?", (req, res) => {
		var data = [];
		const numRecords = req.params.Number;
		for (let i = 0; i < numRecords; i++) {
			data.push("");
		}
		const client = req.db;
		const hdbext = require("@sap/hdbext");
		
		async.each(data, (data, callback) => {
			//(client, Schema, Procedure, callback)
			hdbext.loadProcedure(client, null, "initTestPOs", (err, sp) => {
				if (err) {
					callback(err);
					return;
				}
				//(Input Parameters, callback(errors, Output Scalar Parameters, [Output Table Parameters])
				sp({}, (err, parameters, results) => {
					if (err) {
						callback(err);
						return;
					}
					callback();
				});
			});

		}, (err) => {
			if (err) {
				res.type("text/plain").status(500).send("ERROR: " + err.toString());
				return;
			}
			res.type("text/html").status(200).send("Purchase Order Test Records have been created sucessfully");
		});
	});

	return app;
};