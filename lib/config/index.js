var _ = require('ournet.core')._;


var config = {
  languagesNames: {
    ro: 'Română',
    ru: 'Русский',
    bg: 'Български'
  },
  monthFormat: 'D MMMM',
  startDate: '2015-02-10',
  favicon: 'http://assets.ournetcdn.net/ournet/img/icons/ournet-icon-16.png',
  international: {
    md: {
      it: 'Moldova',
      en: 'Moldova',
      ro: 'Moldova',
      ru: 'Молдова',
      bg: 'Молдова',
      cs: 'Moldavsko',
      hu: 'Moldova',
      pl: 'Mołdawia',
      url: 'http://curs.click.md'
    },
    ro: {
      it: 'Romania',
      en: 'Romania',
      ro: 'România',
      ru: 'Румыния',
      bg: 'Румъния',
      cs: 'Rumunsko',
      hu: 'Románia',
      pl: 'Rumunia',
      url: 'http://curs.ournet.ro'
    },
    ru: {
      it: 'Russia',
      en: 'Russia',
      ro: 'Rusia',
      ru: 'Россия',
      bg: 'Руска федерация',
      cs: 'Rusko',
      hu: 'Oroszországi Föderáció',
      pl: 'Rosja',
      url: 'http://kurs.zborg.ru'
    }
  },
  shareDataServices: ['facebook', 'twitter', 'odnoklassniki', 'google-plus']
};

var data = {};

module.exports = function(country) {
  if (!data[country])
    data[country] = _.assign({}, config, require('./' + country + '.js'));

  return data[country];
}

//process.env.TZ = module.exports.timezone;
