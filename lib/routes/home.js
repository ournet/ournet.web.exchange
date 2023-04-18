'use strict';

var express = require('express');
var utils = require('../utils');
var _ = utils._;
/*eslint new-cap:1*/
var route = module.exports = express.Router();
var util = require('util');
var viewdata = require('../viewdata');
var data = require('../data');

//index

route.get('/:ul' + utils.localePrefix + '?', function(req, res, next) {
	var config = res.locals.config;
	utils.maxageIndex(res);

	var currentCulture = res.locals.currentCulture,
		links = res.locals.links,
		__ = res.locals.__;

	res.locals.location.pop();

	res.locals.title = res.locals.site.head.title = util.format('%s - %s', __('index_page_title'), currentCulture.countryName);
	res.locals.site.head.description = util.format(__('index_info_format'), res.locals.mainSource.getName(currentCulture.language));
	//res.locals.subTitle = res.locals.site.head.description = util.format(__('weather_in_cn_summary'), places.util.inCountryName(currentCulture.countryName, currentCulture.language));
	//res.locals.site.head.keywords = util.format('{0}, {1}, {2}', __('weather'), __('weather2'), currentCulture.countryName);

	res.locals.site.head.canonical = 'https://' + config.host + links.home({
		ul: currentCulture.language
	});

	viewdata({
		banks: true,
		weatherWidget: true,
		exchangeWidget: true,
		rates: {
			options: {
				date: res.locals.currentDateFormated,
				country: config.country,
				currencies: _.take(config.currencies, config.mainCurrenciesCount)
			}
		}
	}, req, res).then(function() {
		res.render('index');
	}, next);
});

route.get('/:ul' + utils.localePrefix + '?/rates/:uniquename', function(req, res, next) {
	var config = res.locals.config;
	utils.maxageIndex(res);

	var currentCulture = res.locals.currentCulture;
	var links = res.locals.links;
	var __ = res.locals.__;
	var uniquename = req.params.uniquename.toLowerCase();

	var source = data.exchange.data.getSourceByUniqueName(config.country, uniquename);

	if (!source) {
		console.log('not found: ', uniquename);
		return res.redirect(links.home({
			ul: currentCulture.language
		}));
	}

	var plusName = '';
	var abbr = source.getAbbr();

	if (abbr && abbr.length < 6) {
		plusName = ' (' + abbr + ')';
	}

	res.locals.site.head.title = util.format('%s - %s', __('exchange_rates'), source.getName(currentCulture.language) + plusName);
	res.locals.site.head.description = util.format(__('bank_info_format'), source.getName(currentCulture.language), source.getName(currentCulture.language) + plusName);

	res.locals.site.head.canonical = 'https://' + config.host + links.exchange.rates(uniquename.toLowerCase(), {
		ul: currentCulture.language
	});

	res.locals.source = source;

	var keys = data.exchange.data.formatRateKeys(config.country, res.locals.currentDate, source.id, config.currencies, 0, 3);

	viewdata({
		banks: true,
		weatherWidget: true,
		exchangeWidget: true,
		sourceRates: {
			name: 'rates',
			options: {
				fillCurrency: true,
				keys: keys
			}
		}
	}, req, res).then(function() {
		res.render('rates');
	}, next);
});
