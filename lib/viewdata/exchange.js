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

  res.locals.exchangeWidget = {
    source: exchange.util.getSource(config.country, config.source),
    rates: []
  };

  function getSources() {
    return exchange.CacheAccessService.instance.getRatesBySource({
      date: res.locals.currentDateFormated,
      country: config.country,
      currencies: _.take(config.currencies, 4)
    }).map(function(rate) {
      return rate.source;
    });
  }

  Promise.props({
      sources: getSources(),
      rates: exchange.CacheAccessService.instance.getFirstDateRates({
        fillCurrency: true,
        keys: exchange.util.formatRateKeys(config.country, res.locals.currentDate, config.source, _.take(config.currencies, 3), 0, 2)
      })
    }).then(function(result) {
      res.locals.banks = result.sources;
      res.locals.exchangeWidget.rates = result.rates;
    }).catch(next)
    .finally(next);

};
