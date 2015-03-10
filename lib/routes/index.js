var home = require('./home');
var viewdata = require('../viewdata');

exports = module.exports = function(app) {
  app.use(viewdata.root);
  //app.use(require('./json.js'));
  app.use(viewdata.exchange);
  app.use(home);
  app.use(require('./controls.js'));
};

function etag(req, res, next) {
  next();
}
