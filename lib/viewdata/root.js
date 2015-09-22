var _package = require('../../package.json'),
  i18n = require('i18n'),
  core = require('ournet.core'),
  exchange = require('ournet.data.exchange'),
  utils = require('../utils.js'),
  data = require('ournet.data'),
  util = {
    moment: require('moment'),
    format: require('util').format,
    startWithUpperCase: core.util.startWithUpperCase,
    numberFormat: core.util.numberFormat,
    _: core._
  };

module.exports = function(req, res, next) {
  var config = res.locals.config;
  var culture = res.locals.currentCulture = {
    language: res.locale,
    country: config.country
  };
  culture.languageName = config.languagesNames[culture.language];
  culture.countryName = res.locals.__('country_' + culture.country);

  res.locals.site = {
    name: config.name,
    head: {}
  };

  res.locals.currentDate = core.date(config.timezone);
  res.locals.currentDateFormated = core.util.formatDate(res.locals.currentDate);

  res.locals.project = {
    version: _package.version,
    name: 'exchange'
  };

  //res.locals.noGoogleAds = true;

  res.locals.util = util;

  res.locals.topBarMenu = [];
  res.locals.showTopPageBar = true;

  for (var project in config.projects) {
    var host = config.projects[project];
    var item = {
      id: project,
      text: res.locals.__(project),
      href: 'http://' + host + res.locals.links.home({
        ul: culture.language
      })
    };
    if (host == config.host) {
      item.cssClass = 'active';
    }
    res.locals.topBarMenu.push(item);
  }

  res.locals.mainSource = exchange.util.getSource(config.country, config.source);
  res.locals.mainSources = [res.locals.mainSource];
  if (config.sources && config.sources.length > 1) {
    for (var i = 1; i < config.sources.length; i++) {
      res.locals.mainSources.push(exchange.util.getSource(config.country, config.sources[i]));
    }
  }

  utils.maxage(res, 60 * 1);

  data.widgets.getWeatherWidget({
    country: config.country,
    lang: culture.language
  }).then(function(widget) {
    res.locals.weatherWidget = widget;
  }).finally(next);
};
