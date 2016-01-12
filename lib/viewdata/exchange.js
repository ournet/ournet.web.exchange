'use strict';

var utils = require('../utils');
var _ = utils._;
var Promise = utils.Promise;
var exchange = require('ournet.data.exchange');

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

	res.locals.banks = [];

	// var sources = res.locals.mainSources;

	function getSources() {
		return exchange.CacheAccessService.instance.getRatesBySource({
			date: res.locals.currentDateFormated,
			country: config.country,
			currencies: _.take(config.currencies, 2)
		}).map(function(rate) {
			return rate.source;
		});
	}

	Promise.props({
		sources: getSources()
	}).then(function(result) {
		res.locals.banks = result.sources;
	}).finally(next);

};
