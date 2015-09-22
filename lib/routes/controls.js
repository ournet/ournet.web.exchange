var express = require('express'),
  core = require('ournet.core'),
  Promise = core.Promise,
  _ = core._,
  route = module.exports = express.Router(),
  exchange = require('ournet.data.exchange'),
  util = require('util'),
  utils = require('../utils.js'),
  internal = {};

route.get('/controls/generalexchangetable', function(req, res, next) {
  var config = res.locals.config,
    currentCulture = res.locals.currentCulture;

  utils.maxageControls(res);
  var selectedSourceId = res.locals.mainSource.id;

  exchange.CacheAccessService.instance.getRatesBySource({
    country: config.country,
    currencies: _.take(config.currencies, config.mainCurrenciesCount),
    date: req.query.date
  }).then(function(rates) {
    var initData = "";
    rates.forEach(function(val) {
      if (val.rates.length > 0) {
        initData += ("data['" + val.source.id + "']=[{cid:'" + config.currency + "',sale:1,buy:1},");
        val.rates.forEach(function(rate) {
          initData += "{cid:'" + rate.currency.code + "',buy:" + rate.buy + ",sale:" + rate.sale + "},";
        });

        initData = initData.substring(0, initData.length - 1) + "];";
      }
    });
    return res.render('controls/main_rates', {
      rates: rates,
      ratesInitData: initData,
      selectedSourceId: selectedSourceId
    });
  }).catch(next);
});
