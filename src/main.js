const client = require('./graphqlClient');
const { getMappedPrData, filterByAuthor } = require('./dataTransformations');
const { printTable } = require('./utils');
const { pullRequestsQuery } = require('./queries');

module.exports = (queryParams) => {
  client
    .query(pullRequestsQuery, queryParams, (req, res) => {
      if (res.status === 401) {
        throw new Error('Not authorized');
      }
    })
    .then(body => {
      const mappedData = getMappedPrData(body);
      const { author: queriedAuthor } = queryParams;

      if (queriedAuthor) {
        printTable(filterByAuthor(mappedData, queriedAuthor));
      } else {
        printTable(mappedData);
      }
    })
    .catch(err => {
      console.log(err.message);
    });
};
