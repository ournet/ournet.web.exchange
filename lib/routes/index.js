var home = require('./home');
var place = require('./place');
var viewdata = require('../viewdata');

exports = module.exports = function(app) {
  app.use(viewdata.root);
  app.use(require('./redirects.js'));
  app.use(require('./json.js'));
  app.use(viewdata.weather);
  app.use(home);
  app.use(place);
  app.use(require('./places.js'));
  app.use(require('./controls.js'));
  app.use(require('./widget.js'));
  app.use(require('./widget2.js'));
};

function etag(req, res, next) {
  next();
}
