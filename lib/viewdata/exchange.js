'use strict';

var utils = require('../utils');
var _ = utils._;
var data = require('../data');

exports.banks = function(locals) {
	var config = locals.config;

	return data.exchange.cacheAccess.getRatesBySource({
		date: locals.currentDateFormated,
		country: config.country,
		currencies: _.take(config.currencies, 2)
	}).map(function(rate) {
		return rate.source;
	});
};


exports.rates = function(locals, options) {
	var config = locals.config;

	return data.exchange.access.getRatesBySource(options)
		.then(function(rates) {
			var initData = '';
			var sourceIds = {};
			rates.forEach(function(val) {
				if (val.rates.length > 0) {
					sourceIds[val.source.id] = true;
					initData += ('data[\'' + val.source.id + '\']=[{cid:\'' + config.currency + '\',sale:1,buy:1},');
					val.rates.forEach(function(rate) {
						initData += '{cid:\'' + rate.currency.code + '\',buy:' + rate.buy + ',sale:' + rate.sale + '},';
					});

					initData = initData.substring(0, initData.length - 1) + '];';
				}
			});
			locals.selectedSourceId = sourceIds[config.source] ? config.source : Object.keys(sourceIds)[0];
			locals.ratesInitData = initData;

			return rates;
		});
};

exports.sourceRates = function(locals, options) {
	return data.exchange.access.getFirstDateRates(options);
};
