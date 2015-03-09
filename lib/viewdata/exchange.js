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

  res.locals.exchangeWidget = {
    source: exchange.util.getSource(config.country, config.source),
    rates: []
  };

  Promise.props({
    sources: exchange.CacheAccessService.instance.getSources({
      country: config.country
    }),
    rates: exchange.CacheAccessService.instance.getRates({
      keys: [exchange.util.formatRateKey(config.country, new Date(), config.source, config.mainCurrencies[0]),
        exchange.util.formatRateKey(config.country, new Date(), config.source, config.mainCurrencies[1])
      ]
    })
  }).then(function(result) {
    res.locals.banks = result.sources;
    res.locals.exchangeWidget.rates = result.rates;
  }).finally(next);

};
