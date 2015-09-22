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
    __ = res.locals.__;

  function processRates(rates) {
    if (!rates) {
      return res.send(rates);
    }
    var source = _.find(res.locals.mainSources, 'id', rates[0].source);
    var result = {
      date: rates[0].date,
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

  function formatRateKeys() {
    var today = res.locals.currentDate;
    var yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    var dates = [today, yesterday];
    var sources = _.pluck(res.locals.mainSources, 'id');
    var keys = utils.formatRateKeys(config.country, dates, sources, _.take(config.currencies, 3));
    return keys;
  }

  exchange.CacheAccessService.instance.getFirstDateRates({
    fillCurrency: true,
    keys: formatRateKeys()
  }).then(processRates).catch(next);
});
