/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
"use strict";
var express = require("express");
var async = require("async");

module.exports = function() {
	var app = express.Router();

	//Hello Router
	app.get("/", function(req, res) {
		res.type("text/html").status(200).send("PO Test Initialization Service");
	});

	app.get("/Create/:Number?", function(req, res) {
		var data = [];
		var numRecords = req.params.Number;
		for (var i = 0; i < numRecords; i++) {
			data.push("");
		}
		var client = req.db;
		var hdbext = require("@sap/hdbext");
		
		async.each(data, function(data, callback) {
			//(client, Schema, Procedure, callback)
			hdbext.loadProcedure(client, null, "initTestPOs", function(err, sp) {
				if (err) {
					callback(err);
					return;
				}
				//(Input Parameters, callback(errors, Output Scalar Parameters, [Output Table Parameters])
				sp({}, function(err, parameters, results) {
					if (err) {
						callback(err);
						return;
					}
					callback();
				});
			});

		}, function(err) {
			if (err) {
				res.type("text/plain").status(500).send("ERROR: " + err.toString());
				return;
			}
			res.type("text/html").status(200).send("Purchase Order Test Records have been created sucessfully");
		});
	});

	return app;
};