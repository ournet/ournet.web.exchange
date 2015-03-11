var express = require('express'),
  core = require('ournet.core'),
  util = require('util'),
  _ = core._,
  utils = require('../utils.js'),
  route = express.Router(),

  ShareInfo = require('../share_info.js'),
  exchange = require('ournet.data.exchange');

//index

route.get('/', function(req, res, next) {
  var config = res.locals.config;
  utils.maxageIndex(res);

  var currentCulture = res.locals.currentCulture,
    links = res.locals.links,
    __ = res.locals.__;

  res.locals.location.pop();

  res.locals.title = res.locals.site.head.title = util.format('%s - %s', __('index_page_title'), currentCulture.countryName);
  res.locals.site.head.description = util.format(__('index_info_format'), res.locals.mainSource.name);
  //res.locals.subTitle = res.locals.site.head.description = util.format(__('weather_in_cn_summary'), places.util.inCountryName(currentCulture.countryName, currentCulture.language));
  //res.locals.site.head.keywords = util.format("{0}, {1}, {2}", __('weather'), __('weather2'), currentCulture.countryName);

  res.locals.site.head.canonical = 'http://' + config.host + links.home({
    ul: currentCulture.language
  });

  res.locals.shareInfo = ShareInfo({
    clientId: "index",
    identifier: res.locals.site.head.canonical,
    url: res.locals.site.head.canonical,
    title: res.locals.site.head.title,
    summary: res.locals.site.head.description
  });

  exchange.CacheAccessService.instance.getRatesBySource({
    date: res.locals.currentDateFormated,
    country: config.country,
    currencies: _.take(config.currencies, 4)
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
    res.render('index', {
      rates: rates,
      ratesInitData: initData
    });
  }).catch(next);
});

route.get('/rates/:uniquename', function(req, res, next) {
  var config = res.locals.config;
  utils.maxageIndex(res);

  var currentCulture = res.locals.currentCulture,
    links = res.locals.links,
    __ = res.locals.__,
    uniquename = req.params.uniquename.toLowerCase(),
    source = exchange.util.getSourceByUniqueName(config.country, uniquename);

  if (!source) {
    console.log('not found: ', uniquename);
    return res.redirect(links.home({
      ul: currentCulture.language
    }));
  }

  res.locals.site.head.title = util.format('%s - %s', __('exchange_rates'), source.getName(currentCulture.language));
  res.locals.site.head.description = util.format(__('bank_info_format'), source.getName(currentCulture.language), source.getName(currentCulture.language));

  res.locals.site.head.canonical = 'http://' + config.host + links.exchange.rates(uniquename.toLowerCase(), {
    ul: currentCulture.language
  });

  res.locals.shareInfo = ShareInfo({
    clientId: "rts" + source.id,
    identifier: res.locals.site.head.canonical,
    url: res.locals.site.head.canonical,
    title: res.locals.site.head.title,
    summary: res.locals.site.head.description
  });

  res.locals.source = source;

  exchange.CacheAccessService.instance.getFirstDateRates({
    fillCurrency: true,
    keys: exchange.util.formatRateKeys(config.country, res.locals.currentDate, source.id, config.currencies, 0, 3)
  }).then(function(rates) {
    res.render('rates', {
      rates: rates
    });
  }).catch(next);
});

exports = module.exports = route;
