'use strict';

var exchange = require('ournet.data.exchange');
var data = require('ournet.data');

exports.common = data;
exports.exchange = {
	access: exchange.AccessService.instance,
	cacheAccess: exchange.CacheAccessService.instance,
	data: exchange.data
};
