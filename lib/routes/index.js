'use strict';

var home = require('./home');
var viewdata = require('../viewdata');

exports = module.exports = function(app) {
  app.use(viewdata.root);
  app.use(require('./redirects'));
  app.use(require('./json'));
  app.use(viewdata.exchange);
  app.use(home);
  app.use(require('./controls'));
};
