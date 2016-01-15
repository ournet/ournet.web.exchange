'use strict';

var home = require('./home');
var middlewares = require('../middlewares');

exports = module.exports = function(app) {
	app.use(middlewares.root);

	app.use(require('./redirects'));

	app.use(middlewares.exchange);

	app.use(require('./json'));

	app.use(middlewares.redirect);
	app.use(home);

	app.use(require('./controls'));
};
