/*eslint no-console: 0, no-unused-vars: 0, no-undef:0*/
/*eslint-env node, es6 */
"use strict";
module.exports = {
	initExpress: () => {
		var xsenv = require("@sap/xsenv");
		var passport = require("passport");
		var xssec = require("@sap/xssec");
		var xsHDBConn = require("@sap/hdbext");
		var express = require("express");

		//Initialize Express App for XS UAA and HDBEXT Middleware
		var app = express();
/*		passport.use("JWT", new xssec.JWTStrategy(xsenv.getServices({
			uaa: {
				tag: "xsuaa"
			}
		}).uaa));

		app.use(passport.initialize());*/
		var hanaOptions = xsenv.getServices({
			hana: {
				tag: "hana"
			}
		});
		hanaOptions.hana.rowsWithMetadata = true;		
		app.use(
/*			passport.authenticate("JWT", {
				session: false
			}),*/
			xsHDBConn.middleware(hanaOptions.hana)
		);
		return app;
	},

	initXSJS: (app) => {
		var xsjs = require("@sap/xsjs");
		var xsenv = require("@sap/xsenv");
		var options = {
			anonymous : true, // remove to authenticate calls
			redirectUrl: "/index.xsjs",
			context: {
				base: global.__base,
				env: process.env
			}
		};

		//configure HANA
		try {
			options = Object.assign(options, xsenv.getServices({
				hana: {
					tag: "hana"
				}
			}));
			options = Object.assign(options, xsenv.getServices({
				secureStore: {
					tag: "hana"
				}
			}));
		} catch (err) {
			console.log("[WARN]", err.message);
		}

		// configure UAA
		try {
			options = Object.assign(options, xsenv.getServices({
				uaa: {
					tag: "xsuaa"
				}
			}));
		} catch (err) {
			console.log("[WARN]", err.message);
		}

		// start server
		var xsjsApp = xsjs(options);
		app.use(xsjsApp);
	}
};