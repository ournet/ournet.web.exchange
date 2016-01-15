'use strict';

var express = require('express');
var utils = require('../utils');
var _ = utils._;
/*eslint new-cap:1*/
var route = module.exports = express.Router();
var viewdata = require('../viewdata');

route.get('/:ul' + utils.localePrefix + '?/controls/generalexchangetable/:date', function(req, res, next) {
	var config = res.locals.config;

	utils.maxageControls(res);

	viewdata({
		rates: {
			options: {
				country: config.country,
				currencies: _.take(config.currencies, config.mainCurrenciesCount),
				date: req.params.date
			}
		}
	}, req, res).then(function() {
		res.render('controls/main_rates');
	}, next);
});
