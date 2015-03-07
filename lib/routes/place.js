var express = require('express'),
  core = require('ournet.core'),
  _ = core._,
  route = module.exports = express.Router(),
  places = require('ournet.data.places'),
  weather = require('ournet.data.weather'),
  util = require('util'),
  utils = require('../utils.js'),
  ShareInfo = require('../share_info.js'),
  latestPlaces = require('../latest_places.js'),
  internal = {};

route.param('prefix', utils.routePrefix);
// place: /vremea/786654
route.get('/' + utils.route_prefix + '/:id(\\d+)', function(req, res, next) {
  utils.maxagePlace(res);

  var date = Date.now(),
    id = parseInt(req.params.id);

  internal.getPlace(id).then(function(place) {
    if (!place) {
      core.logger.error('Not found place', {
        placeid: id,
        url: req.originalUrl
      });
      return res.redirect(res.locals.links.weather.home());
    }
    internal.renderPlace(req, res, place, next);
  }).catch(next);
});

internal.renderPlace = function(req, res, place, next) {
  var config = res.locals.config;
  var links = res.locals.links,
    lang = res.locals.currentCulture.language,
    selflink = links.weather.place(place.id, {
      ul: lang
    }),
    displayname = places.util.inPlaceName(place, lang),
    __ = res.locals.__;

  res.locals.affix = true;

  res.locals.site.head.canonical = 'http://' + config.host + selflink;


  internal.getWeather(place).then(function(report) {
    var info = internal.formatPageInfo(place, res);
    res.locals.site.head.title = info.pageTitle;
    res.locals.site.head.description = info.description;
    res.locals.site.head.keywords = info.keywords;

    res.locals.shareInfo = ShareInfo({
      clientId: 'p' + place.id,
      identifier: ['weather', place.id, lang].join('-'),
      url: res.locals.site.head.canonical,
      title: res.locals.site.head.title,
      summary: res.locals.site.head.description
    });

    res.locals.location.push({
      href: links.weather.places({
        ul: lang
      }),
      text: __('places')
    });

    if (place.region) {
      res.locals.location.push({
        href: links.weather.place(place.region.id, {
          ul: lang
        }),
        text: place.region.getName(lang)
      });

      latestPlaces.put(place);
    }
    res.locals.location.push({
      href: links.weather.place(place.id, {
        ul: lang
      }),
      text: place.getName(lang)
    });

    if (!report) {
      utils.maxage(res, 0);
    }

    //return res.send(place);
    res.render('place', {
      place: place,
      report: report,
      title: info.title,
      subTitle: info.subTitle
    });
    //res.send(report);
  }).catch(next);
};

internal.getPlace = function(id) {
  return places.CacheAccessService.instance.getPlace({
    id: id,
    getRegion: true
  });
};

internal.formatPageInfo = function(place, res) {
  var info = {
      title: null,
      subTitle: null,
      description: null,
      keywords: null
    },
    lang = res.locals.currentCulture.language,
    currentCulture = res.locals.currentCulture,
    displayname = place.getName(lang),
    inname = places.util.inPlaceName(place, lang),
    adm1 = place.region,
    __ = res.locals.__;

  //if is adm1
  if (!adm1) {
    info.pageTitle = util.format(__('weather_item_head_title_format'), inname, displayname);

    info.description =
      util.format(__('weather_item_head_description_format'), inname + util.format(" (%s)", place.name), place.asciiname);

    info.title = util.format(__('weather_title_format'), inname);
    info.keywords = util.format("%s, %s, %s, %s", displayname, __('weather'),
      __('weather2'), currentCulture.countryName);
  } else {

    var shortadmname = places.util.shortAdm1Name(place.region, lang);

    var longname = inname;

    if (!places.util.isTown(place) && !places.util.isCity(place)) {
      longname = (place.name != adm1.name && !adm1.name.indexOf(place.name) > -1) ? util.format("%s, %s", longname, shortadmname) : longname;
    }

    info.pageTitle = util.format(__('weather_item_head_title_format'), longname, displayname);

    if (info.pageTitle.length > 80) {
      info.pageTitle = util.format(__('weather_item_head_title_format'), longname, displayname);
    }

    info.description =
      util.format(__('weather_item_head_description_format'),
        longname + util.format(" (%s, %s)", place.asciiname, adm1.asciiname), place.name);

    info.subTitle = util.format(__('place_weather_details_info'), longname, util.format("%s, %s", place.asciiname, adm1.asciiname), displayname);

    info.title = util.format(__('weather_title_format'), longname);

    info.keywords = util.format("%s, %s, %s, %s", longname, __('weather'), __('weather2'), currentCulture.countryName);
  }
  if (lang == 'ro')
    info.pageTitle = core.util.romanianAtonic(info.pageTitle);

  return info;
};

internal.getWeather = function(place) {
  return weather.CacheAccessService.instance.getForecast(weather.forecast.formatSelector(place));
};
