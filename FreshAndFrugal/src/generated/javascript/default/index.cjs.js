const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'Fresh-and-Frugal',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

