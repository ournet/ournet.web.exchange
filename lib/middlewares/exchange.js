'use strict';

var utils = require('../utils');
var data = require('../data');

module.exports = function(req, res, next) {
	var config = res.locals.config;
	var lang = res.locals.currentCulture.language;

	res.locals.location = [{
		href: res.locals.links.home({
			ul: lang
		}),
		text: res.locals.__('home')
	}];

	utils.maxage(res, 60 * 2);

	res.locals.minDateFormated = config.startDate;

	res.locals.mainSource = data.exchange.data.getSource(config.country, config.source);
	res.locals.mainSources = [res.locals.mainSource];

	next();
};
