var express = require('express'),
  core = require('ournet.core'),
  Promise = core.Promise,
  _ = core._,
  route = module.exports = express.Router(),
  places = require('ournet.data.places'),
  weather = require('ournet.data.weather'),
  util = require('util'),
  utils = require('../utils.js'),
  internal = {};

route.param('prefix', utils.routePrefix);

// places: /vremea/places
route.get('/' + utils.route_prefix + '/places', function(req, res, next) {
  var date = Date.now();
  var config = res.locals.config;

  utils.maxagePlaces(res);

  if (req.query.q)
    return internal.renderSearch(req, res, req.query.q, next);

  function render(regions) {
    var links = res.locals.links,
      currentCulture = res.locals.currentCulture,
      lang = currentCulture.language,
      __ = res.locals.__;

    res.locals.site.head.canonical = 'http://' + config.host + links.weather.places();

    res.locals.location.push({
      href: links.weather.places(),
      text: __('places')
    });

    res.locals.title = util.format(__('search_place_in_cn'), places.util.inCountryName(currentCulture.countryName, lang));

    res.locals.site.head.title = res.locals.title;

    res.render('regions', {
      regions: regions
    });
  }

  internal.getRegions(config.country).then(render).catch(next);
});

// places: /vremea/places/92
route.get('/' + utils.route_prefix + '/places/:adm1', function(req, res, next) {
  var config = res.locals.config;
  var date = Date.now(),
    adm1 = req.params.adm1,
    links = res.locals.links;

  utils.maxagePlaces(res);

  function render(placeslist, region) {

    var
      currentCulture = res.locals.currentCulture,
      lang = currentCulture.language,
      __ = res.locals.__;

    res.locals.site.head.canonical = 'http://' + config.host + links.weather.places.byAdm1(adm1);

    res.locals.location.push({
      href: links.weather.places({
        ul: lang
      }),
      text: __('places')
    });

    res.locals.title = util.format(__('search_place_in_cn_format'), region.getName(lang), currentCulture.countryName);

    res.locals.site.head.title = res.locals.title;
    //return res.send(placeslist);
    res.render('places', {
      places: placeslist,
      region: region,
      limit: 90
    });
  }

  Promise.props({
      places: internal.getPlaces(config.country, adm1),
      region: places.CacheAccessService.instance.getRegionByAdmin1({
        country_code: config.country,
        admin1_code: adm1
      })
    })
    .then(function(result) {
      if (!result.region) {
        core.logger.error('Not found region ' + adm1 + '-' + config.country);
        return res.redirect(links.weather.home());
      }
      render(result.places, result.region);
    }).catch(next);
});

internal.renderSearch = function(req, res, query, next) {
  var links = res.locals.links,
    currentCulture = res.locals.currentCulture,
    date = Date.now(),
    diff,
    __ = res.locals.__;

  utils.maxage(res, 0);

  places.SearchService.instance.search({
    query: query,
    country: currentCulture.country
  }).then(function(places) {
    diff = Date.now() - date;
    if (diff > 100) {
      core.logger.warn('Search too long time: ' + diff, {
        time: diff,
        query: query
      });
    }
    //console.log(places);
    if (places.length == 1)
      return res.redirect(links.weather.place(places[0].id, {
        ul: currentCulture.language
      }));

    res.locals.location.push({
      href: links.weather.places({
        ul: currentCulture.language
      }),
      text: __('places')
    });

    res.locals.title = util.format(__('search_place_format'), query);

    res.locals.site.head.title = res.locals.title;

    res.render('places', {
      places: places
    });
  }).catch(next);
};

internal.getRegions = function(country_code) {
  //var date = Date.now();
  return places.CacheAccessService.instance.queryRegions({
    key: country_code,
    limit: 90
  }).then(function(result) {
    //console.log('got result in ', (Date.now() - date) + ' ms');
    return result;
  });
};

internal.getPlaces = function(country_code, adm1) {
  //var date = Date.now();
  return places.CacheAccessService.instance.queryPlacesByAdm1Key({
    key: [country_code, adm1].join('-'),
    limit: 90
  }).then(function(result) {
    //console.log('got result in ', (Date.now() - date) + ' ms');
    return result;
  });
};
