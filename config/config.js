const selectedEnvironment = 'local'; // Change to development/staging/production when needed

const local = require('../config/local');
const development = require('../config/development');
const staging = require('../config/staging');
const production = require('../config/production');

const configMap = {
  local,
  development,
  staging,
  production,
};

const config = configMap[selectedEnvironment];

module.exports = {
  ...config,
  environment: selectedEnvironment,
};
