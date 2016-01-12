'use strict';

var _ = require('../utils')._;

var config = {
	languagesNames: {
		ro: 'Română',
		ru: 'Русский',
		bg: 'Български'
	},
	monthFormat: 'D MMMM',
	startDate: '2015-02-10',
	decimals: 2,
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
		},
		bg: {
			it: 'Bulgaria',
			en: 'Bulgaria',
			ro: 'Bulgaria',
			ru: 'Болгария',
			bg: 'България',
			cs: 'Bulharsko',
			hu: 'Bulgária',
			pl: 'Bułgaria',
			url: 'http://valuta.ournet.bg'
		}
	},
	shareDataServices: ['facebook', 'twitter', 'odnoklassniki', 'google-plus'],
	mainCurrenciesCount: 4
};

var data = {};

module.exports = function(country) {
	if (!data[country]) {
		data[country] = _.assign({}, config, require('./' + country + '.js'));
	}

	return data[country];
};

//process.env.TZ = module.exports.timezone;
