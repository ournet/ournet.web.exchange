'use strict';

var utils = require('../utils');
var _ = utils._;
var Promise = utils.Promise;

var NAMES = ['common', 'exchange'];
var MAP = {};

function loadModules() {
	NAMES.forEach(function(name) {
		var m = require('./' + name);
		for (var prop in m) {
			if (MAP[prop]) {
				throw new Error('Property `' + prop + '` already exists!');
			}
			MAP[prop] = m;
		}
	});
}

loadModules();

function loadViewdataProperty(locals, name, options) {
	var source = MAP[name];
	return source[name](locals, options);
}

function loadViewdataItem(locals, item) {
	var props = {};

	if (typeof item === 'string') {
		props[item] = loadViewdataProperty(locals, item);
	} else {
		for (var prop in item) {
			props[item[prop].name || prop] = loadViewdataProperty(locals, prop, item[prop].options);
		}
	}

	return Promise.props(props)
		.then(function(result) {
			_.assign(locals, result);
			return result;
		});
}

module.exports = function loadViewdata(items, req, res) {
	items = Array.isArray(items) ? items : [items];
	return Promise.mapSeries(items, function(item) {
		return loadViewdataItem(res.locals, item);
	}).then(function(results) {
		return _.assign.apply(null, results);
	});
};
