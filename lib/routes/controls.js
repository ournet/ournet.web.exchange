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

route.get('/controls/findplace', function(req, res, next) {
  var config = res.locals.config;
  var q = req.query.q,
    limit = parseInt(req.query.limit || 10),
    currentCulture = res.locals.currentCulture;

  utils.maxage(res, 0);

  places.SearchService.instance.suggest({
    query: q,
    country: config.country
  }).then(function(places) {
    var list = [];
    if (places) {
      places.forEach(function(item) {
        var place = {
          id: item.id,
          name: item.getName(currentCulture.language),
          region: {
            name: item.region.getName(currentCulture.language)
          }
        };
        list.push(place);
      });
    }

    return res.send(list);
  }).catch(next);
});

// places: /controls/more_places/82/123222.json
route.get('/controls/more_places/:adm1/:id.json', function(req, res, next) {
  var config = res.locals.config;
  internal.getPlaces(config.country, req.params.adm1, req.params.id)
    .then(function(places) {
      res.setHeader('cache-control', 'public, max-age=' + (86400 * 10));

      return res.send(places);
    }).catch(next);
});

route.get('/controls/main_places_weather/:date', function(req, res, next) {
  var config = res.locals.config;
  places.CacheAccessService.instance.getPlaces({
    ids: config.mainPlaces,
    getRegon: true
  }).then(function(places) {
    return weather.CacheAccessService.instance.getPlacesForecast({
        country_code: config.country,
        date: req.params.date,
        places: places
      })
      .then(function(result) {
        utils.maxagePlaces(res);
        res.render('controls/main_places_weather', {
          placesWeather: result
        });
      });
  }).catch(next);
});

internal.getPlaces = function(country_code, adm1, id) {
  var date = Date.now(),
    key = [country_code, adm1].join('-');
  return places.CacheAccessService.instance.queryPlacesByAdm1Key({
    key: [country_code, adm1].join('-'),
    limit: 30,
    startKey: {
      hashKey: key,
      rangeKey: 0
    }
  }).then(function(result) {
    //console.log('got result in ', (Date.now() - date) + ' ms');
    return result;
  });
};
