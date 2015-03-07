var core = require('ournet.core'),
  md5 = core.util.md5,
  Promise = core.Promise,
  utils = require('../utils.js'),
  latestPlaces = require('../latest_places.js'),
  weather = require('ournet.data.weather'),
  places = require('ournet.data.places'),
  newsService = require('../data/news_service.js');

module.exports = function(req, res, next) {
  var config = res.locals.config;
  var lang = res.locals.currentCulture.language;
  res.locals.util.weather = {
    symbolName: function(symbol, lang) {
      return weather.util.symbolName(symbol, lang);
    },
    windDirectionCss: utils.windDirectionCss
  };
  res.locals.location = [{
    href: res.locals.links.home({
      ul: lang
    }),
    text: res.locals.__('home')
  }];

  utils.maxage(res, 60 * 4);

  res.locals.latestPlaces = latestPlaces.get(config.country);

  Promise.props({
    stories: newsService.getStories(config, lang),
    places: places.CacheAccessService.instance.getPlaces({
      ids: config.mainPlaces,
      getRegion: true,
      sort: true
    })
  }).then(function(result) {
    res.locals.stories = result.stories;
    res.locals.mainPlaces = result.places;
  }).error(function(error) {
    core.logger.error(error.message, error);
  }).finally(next);
};
