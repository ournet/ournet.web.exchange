var core = require('ournet.core'),
  md5 = core.util.md5,
  Promise = core.Promise,
  utils = require('../utils.js'),
  exchange = require('ournet.data.exchange'),
  minDate = new Date('2015-02-10'),
  minDateFormat = core.util.formatDate(minDate);

module.exports = function(req, res, next) {
  var config = res.locals.config;
  var lang = res.locals.currentCulture.language;

  res.locals.location = [{
    href: res.locals.links.home({
      ul: lang
    }),
    text: res.locals.__('home')
  }];

  utils.maxage(res, 60 * 4);
  var date = new Date();
  res.locals.todayFormated = core.util.formatDate(date);
  res.locals.minDateFormated = minDateFormat;

  res.locals.banks = [];

  res.locals.mainExchangeSource = {};

  exchange.CacheAccessService.instance.getSources({
    country: config.country
  }).then(function(sources) {
    res.locals.banks = sources;
  }).finally(next);

  // Promise.props({
  //   stories: newsService.getStories(config, lang),
  //   places: places.CacheAccessService.instance.getPlaces({
  //     ids: config.mainPlaces,
  //     getRegion: true,
  //     sort: true
  //   })
  // }).then(function(result) {
  //   res.locals.stories = result.stories;
  //   res.locals.mainPlaces = result.places;
  // }).error(function(error) {
  //   core.logger.error(error.message, error);
  // }).finally(next);
};
