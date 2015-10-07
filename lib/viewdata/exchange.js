var core = require('ournet.core'),
  _ = core._,
  md5 = core.util.md5,
  Promise = core.Promise,
  utils = require('../utils.js'),
  exchange = require('ournet.data.exchange');

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
  res.locals.minDateFormated = config.startDate;

  res.locals.banks = [];

  var sources = res.locals.mainSources;

  function getSources() {
    return exchange.CacheAccessService.instance.getRatesBySource({
      date: res.locals.currentDateFormated,
      country: config.country,
      currencies: _.take(config.currencies, config.mainCurrenciesCount)
    }).map(function(rate) {
      return rate.source;
    });
  }

  function formatRateKeys() {
    var today = res.locals.currentDate;
    var yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    var dates = [today, yesterday];
    var sources = _.pluck(res.locals.mainSources, 'id');
    var keys = utils.formatRateKeys(config.country, dates, sources, _.take(config.currencies, 3));
    return keys;
  }

  function getWidgetRates() {
    return exchange.CacheAccessService.instance.getFirstDateRates({
      fillCurrency: true,
      keys: formatRateKeys()
    });
  }

  Promise.props({
    sources: getSources(),
  }).then(function(result) {
    res.locals.banks = result.sources;
  }).finally(next);

};
