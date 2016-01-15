'use strict';

var url = require('url');

module.exports = function(req, res, next) {
	var config = res.locals.config;
	var lang = res.locals.currentCulture.language;

	if (req.query.ul) {
		var ul = req.query.ul.trim().toLowerCase();
		delete req.query.ul;

		var rurl = url.format({
			pathname: req.path,
			query: req.query
		});

		if (config.language !== ul && ~config.languages.indexOf(ul) && req.path.indexOf('/' + ul + '/') !== 0) {
			rurl = '/' + ul + rurl;
		}

		return res.redirect(301, rurl);
	}

	next();
};
