const gqlclient = require('graphql-client');
const { token } = require('../config');

module.exports = gqlclient({
  url: 'https://api.github.com/graphql',
  headers: {
    Authorization: `Bearer ${token}`
  }
});
