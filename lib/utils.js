'use strict';


var utils = require('ournet.utils');
var _ = require('lodash');
var Promise = require('bluebird');
var exchange = require('ournet.data.exchange');

var NO_CACHE = 'private, max-age=0, no-cache';
var PUBLIC_CACHE = 'public, max-age=';
var CACHE_CONTROL = 'Cache-Control';
/**
 * Set response Cache-Control
 * @maxage integet in minutes
 */
var maxage = exports.maxage = function(res, time) {
	//maxage=0;
	var cache = NO_CACHE;
	if (time > 0) {
		cache = PUBLIC_CACHE + (time * 60);
		//res.set('Expires', new Date(Date.now() + (time * 60 * 1000)).toUTCString());
	}
	res.set(CACHE_CONTROL, cache);
};

exports.maxageRedirect = function(res) {
	maxage(res, 60 * 12);
};

exports.maxageControls = function(res) {
	maxage(res, 60 * 12);
};

exports.maxageJson = function(res) {
	maxage(res, 60 * 1);
};

exports.maxageRates = function(res) {
	maxage(res, 30);
};

exports.maxageIndex = function(res) {
	maxage(res, 30);
};

exports.formatRateKeys = function(country, dates, sources, currencies) {
	var data = [];
	dates = Array.isArray(dates) ? dates : [dates];
	sources = Array.isArray(sources) ? sources : [sources];
	currencies = Array.isArray(currencies) ? currencies : [currencies];

	sources.forEach(function(source) {
		dates.forEach(function(date) {
			currencies.forEach(function(currency) {
				data.push(exchange.data.formatRateKey(country, date, source, currency));
			});
		});
	});

	return data;
};

exports.localePrefix = '(ru)';

module.exports = exports = _.assign({
	_: _,
	Promise: Promise
}, exports, utils);
