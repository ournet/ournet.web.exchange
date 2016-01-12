'use strict';

var logger = module.exports = require('ournet.logger');

logger.loggly({
	tags: ['exchange', 'web'],
	json: true
});

if (process.env.NODE_ENV === 'production') {
	logger.removeConsole();
}
