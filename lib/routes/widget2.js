var express = require('express'),
  core = require('ournet.core'),
  _ = core._,
  route = module.exports = express.Router(),
  places = require('ournet.data.places'),
  weather = require('ournet.data.weather'),
  util = require('util'),
  ShareInfo = require('../share_info.js'),
  internal = {},
  widgetData = require('../data/widget2.js');


route.get('/widget2', function(req, res, next) {
  var config = res.locals.config;
  var __ = res.locals.__,
    currentCulture = res.locals.currentCulture,
    links = res.locals.links;

  res.locals.site.pageLayoutCss = 'form-layout';
  res.locals.site.head.title = util.format('%s - %s', __('weather_on_your_site'), config.name);
  res.locals.site.head.description = util.format(__('weather_on_your_site_info'), places.util.inCountryName(currentCulture.countryName, currentCulture.language));

  res.locals.site.head.canonical = 'http://' + config.host + links.weather.widget2({
    ul: currentCulture.language
  });

  res.locals.shareInfo = ShareInfo({
    clientId: 'widget2',
    identifier: res.locals.site.head.canonical,
    url: res.locals.site.head.canonical,
    title: res.locals.site.head.title,
    summary: res.locals.site.head.description
  });

  places.CacheAccessService.instance.getPlace({
    id: config.capitalId,
    getRegion: true
  }).then(function(place) {
    res.render('widget2/index', {
      place: place
    });
  }).catch(next);

});

route.get('/widget2/widget_html_script', function(req, res) {
  var config = res.locals.config;
  req.query.days = parseInt(req.query.days);
  var formatter = widgetData.formatter(req.query);

  var params = [];

  for (var prop in req.query)
    if (!core.util.isNullOrEmpty(req.query[prop]))
      params.push(prop + '=' + req.query[prop]);

  params = params.join(',');

  var data = ['<!-- ' + config.name + ' Weather Widget -->',
    '<ins class="ournetweatherwidget" style="display:inline-block;width:' + req.query.w + 'px;height:' + formatter.iframeHeight + 'px" data-cn="' + config.country + '" data-params="' + params + '" data-w="' + req.query.w + '" data-h="' + formatter.iframeHeight + '"></ins>',
    '<noscript><p><a href="http://' + config.host + '">' + config.name + '</a></p></noscript>',
    '<script>',
    '    (ournetweatherwidget = window.ournetweatherwidget || []).push({});',
    '</script>',
    '<script async src="http://assets.ournetcdn.net/ournet/js/weather-widget2.min.js"></script>'
  ].join('\n');

  res.send(data);
});

route.get('/widget2/widget_frame', function(req, res, next) {
  var config = res.locals.config;
  var links = res.locals.links;
  var formatter = widgetData.formatter(req.query);

  widgetData.format(config, formatter, req.query, links, res.locals.__, res.locals.currentCulture.language)
    .then(function(data) {
      //res.set('Content-Type', 'text/html');
      //res.set('Cache-Control', 'public, ');
      res.render('widget2/frame', {
        widget: data.html,
        formatter: formatter,
        place: data.place,
        query: req.query
      });
    }).catch(next);
});
