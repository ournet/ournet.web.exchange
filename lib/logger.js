"use strict";

module.exports = {
	info: function () {
		console.info(...arguments);
	},
	warn: function () {
		console.warn(...arguments);
	},
	error: function () {
		console.error(...arguments);
	},
};
