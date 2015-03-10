var extern = module.exports,
  core = require('ournet.core');

var NO_CACHE = 'private, max-age=0, no-cache';
var PUBLIC_CACHE = 'public, max-age=';
var CACHE_CONTROL = 'Cache-Control';
/**
 * Set response Cache-Control
 * @maxage integet in minutes
 */
extern.maxage = function(res, maxage) {
  //maxage=0;
  var cache = NO_CACHE;
  if (maxage > 0) {
    cache = PUBLIC_CACHE + (maxage * 60);
    //res.set('Expires', new Date(Date.now() + (maxage * 60 * 1000)).toUTCString());
  }
  res.set(CACHE_CONTROL, cache);
};

extern.maxageRedirect = function(res) {
  extern.maxage(res, 60 * 12);
};

extern.maxageControls = function(res) {
  extern.maxage(res, 60 * 12);
};

extern.maxageRates = function(res) {
  extern.maxage(res, 60 * 2);
};

extern.maxageIndex = function(res) {
  extern.maxage(res, 60 * 1);
};