'use strict';

var config = require('./config');
var urlset = require('urlset');
var path = require('path');

var hosts = {
	'curs.click.md': 'md',
	'curs.ournet.ro': 'ro',
	'kurs.zborg.ru': 'ru',
	'valuta.our.bg': 'bg',
	'valuta.ournet.hu': 'hu',
	'mena.ournet.cz': 'cz'
};

function getCountry(req) {
	return hosts[req.hostname] || process.env.COUNTRY;
}

var links = {};

function getLinks(country, language) {
	if (!links[country]) {
		var l = new urlset.Provider({
			params: []
		});
		l.load(path.join(__dirname, 'sitemap.json'));
		l.setParam({
			name: 'ul',
			value: language,
			format: 's'
		});
		links[country] = l.url;
	}
	return links[country];
}

module.exports = function(req, res, next) {
	var country = getCountry(req);
	if (!country) {
		return next(new Error('Invalid hostname', {
			hostname: req.hostname
		}));
	}
	var conf = config(country);
	res.locals.config = conf;
	res.locals.links = getLinks(conf.country, conf.language);
	next();
};
