var express = require('express'),
  core = require('ournet.core'),
  _ = core._,
  route = module.exports = express.Router(),
  exchange = require('ournet.data.exchange'),
  utils = require('../utils.js'),
  util = require('util'),
  internal = {};


route.get('/json/widget.json', function(req, res, next) {
  var config = res.locals.config;

  utils.maxageJson(res);

  var
    links = res.locals.links,
    lang = res.locals.currentCulture.language,
    __ = res.locals.__,
    source = res.locals.mainSource,
    sources = res.locals.mainSources;

  function processRates(rates) {
    if (!rates) {
      return res.send(rates);
    }
    var result = {
      source: {
        uniqueName: source.uniqueName,
        name: source.getName(lang),
        shortName: source.getShortName(lang),
        abbr: source.getAbbr(lang)
      },
      rates: [],
      url: 'http://' + config.host + links.home({
        ul: lang
      })
    };

    rates.forEach(function(rate) {
      result.rates.push({
        buy: rate.buy,
        sale: rate.sale,
        buy1d: rate.buy1d,
        sale1d: rate.sale1d,
        currency: {
          code: rate.currency.code,
          symbol: rate.currency.symbol,
          name: rate.currency.getName(lang)
        }
      })
    });

    res.send(result);
  }

  exchange.CacheAccessService.instance.getFirstDateRates({
    fillCurrency: true,
    keys: exchange.util.formatRateKeys(config.country, res.locals.currentDate, source.id, _.take(config.currencies, 3), 0, 2)
  }).then(function(rates) {
    if ((!rates || rates.length === 0) && sources) {
      source = sources[1];
      // console.log(source);
      return exchange.CacheAccessService.instance.getFirstDateRates({
        fillCurrency: true,
        keys: exchange.util.formatRateKeys(config.country, res.locals.currentDate, source.id, _.take(config.currencies, 3), 0, 2)
      }).then(processRates);
    }
    processRates(rates);
  }).catch(next);
});
