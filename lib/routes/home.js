var express = require('express'),
  core = require('ournet.core'),
  util = require('util'),
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

  var date = core.util.formatDate(new Date());
  exchange.CacheAccessService.instance.getRatesBySource({
    country: config.country
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

// public ActionResult Rates(string id)
//         {
//             id = id.ToLower();
//             var viewData = CreateExchangeViewData<RatesViewData>(id.ToUpper());

//             viewData.Source = ExchangeAccessService.Source(id, viewData.CurrentCulture.Country,
//                                                            viewData.CurrentCulture.Language);

//             if (viewData.Source == null) return Redirect(Links.Exchange.Home());

//             viewData.Head.Title = string.Format("{0} - {1}",Resources.Exchange.exchange_rates,viewData.Source.Name);
//             viewData.Head.Canonical = Links.Exchange.Rates(id).ToFullUrl();

//             viewData.ShareInfo = new ShareItemInfo
//                 {
//                     ClientId = "rates-" + id + "-" + viewData.CurrentCulture.Language,
//                     Url = viewData.Head.Canonical,
//                     Title = viewData.Head.Title,
//                     Identifier = viewData.Head.Canonical
//                 };

//             return View(viewData);
//         }

exports = module.exports = route;
