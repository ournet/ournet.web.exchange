'use strict';

var _package = require('../../package.json');
var utils = require('../utils');
var time = require('time');

var util = {
	moment: require('moment'),
	format: require('util').format,
	_: utils._,
	startWithUpperCase: function(name) {
		if (name) {
			return name.substr(0, 1).toUpperCase() + name.substr(1);
		}
		return name;
	},
	numberFormat: utils.number.format
};

module.exports = function(req, res, next) {
	var config = res.locals.config;
	var culture = res.locals.currentCulture = {
		language: res.locale,
		country: config.country
	};
	culture.languageName = config.languagesNames[culture.language];
	culture.countryName = res.locals.__('country_' + culture.country);

	res.locals.site = {
		name: config.name,
		head: {}
	};

	var currentDate = res.locals.currentDate = new time.Date();
	currentDate.setTimezone(config.timezone);

	res.locals.currentDateFormated = utils.formatDate(currentDate);

	res.locals.project = {
		version: _package.version,
		name: 'exchange'
	};

	res.locals.util = util;

	res.locals.topBarMenu = [];
	res.locals.showTopPageBar = true;

	for (var project in config.projects) {
		var host = config.projects[project];
		var item = {
			id: project,
			text: res.locals.__(project),
			href: 'http://' + host
		};
		if (host === config.host) {
			item.cssClass = 'active';
		}
		res.locals.topBarMenu.push(item);
	}

	next();
};
