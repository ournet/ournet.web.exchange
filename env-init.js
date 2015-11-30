/*eslint no-process-exit:0*/

'use strict';

var dotenv = require('dotenv-prompt');

var envs = ['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'ES_HOST', 'LOGGLY_TOKEN'];

var options = {
  defaults: {
    'LOGGLY_DOMAIN': 'ournet',
    'NODE_ENV': 'production',
    'AWS_REGION': 'eu-central-1',
    'PORT': 1510
  }
};

dotenv.create(envs, options, function(error) {
  if (error) {
    console.error(error);
    process.exit(1);
  }
});
