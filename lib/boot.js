var config = require('./config'),
  urlset = require('urlset');

module.exports = function(req, res, next) {
  var conf = config(getCountry(req));
  res.locals.config = conf;
  res.locals.links = getLinks(conf.country, conf.language);
  next();
}

var hosts = {
  'o-curs.click.md': 'md',
  'o-curs.ournet.ro': 'ro',
  'o-kurs.zborg.ru': 'ru'
};

function getCountry(req) {
  return hosts[req.hostname] || process.env.COUNTRY;
}

var links = {};

function getLinks(country, language) {
  if (!links[country]) {
    var l = new urlset.Provider({
      params: []
    });
    l.load(__dirname + '/sitemap/index.json');
    l.setParam({
      name: 'ul',
      value: language,
      type: 'q'
    });
    links[country] = l.url;
  }
  return links[country];
}
