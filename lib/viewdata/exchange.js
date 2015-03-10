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
  var date = new Date();
  res.locals.todayFormated = core.util.formatDate(date);
  res.locals.minDateFormated = config.startDate;

  res.locals.banks = [];

  res.locals.exchangeWidget = {
    source: exchange.util.getSource(config.country, config.source),
    rates: []
  };

  Promise.props({
    sources: exchange.CacheAccessService.instance.getSources({
      country: config.country
    }),
    rates: exchange.CacheAccessService.instance.getFirstDateRates({
      fillCurrency: true,
      keys: exchange.util.formatRateKeys(config.country, config.source, _.take(config.currencies, 3), 0, 2)
    })
  }).then(function(result) {
    res.locals.banks = result.sources;
    res.locals.exchangeWidget.rates = result.rates;
  }).finally(next);

};
