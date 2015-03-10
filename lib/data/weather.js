var request = require('request'),
  core = require('ournet.core'),
  Promise = core.Promise,
  cache = new core.MemoryCache({
    ttl: 60 * 10
  }),
  extern = module.exports;

extern.getWidget = function(country, lang) {
  var key = country + lang;

  var result = cache.get(key);

  if (result) return Promise.resolve(result);

  return new Promise(function(resolve, reject) {
    var cw = core.constants.portal['weather'];
    request({
      url: 'http://' + cw.hosts[country] + '/json/today/' + cw.capitals[country] + '.json?ul=' + lang,
      timeout: 1000 * 2
    }, function(error, response, body) {
      if (error) return reject(error);
      body = JSON.parse(body);
      if (body) {
        cache.set(key, body);
      }
      resolve(body);
    });
  });
};
