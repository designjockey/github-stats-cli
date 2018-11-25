const client = require('./graphqlClient');
const { mapData } = require('./dataTransformations');
const { constructSearchQueryString, printTable } = require('./utils');
const saveCsv = require('./fileUtils');
const { pullRequestsQuery, reviewsQuery } = require('./queries');

const getData = cliOptions => {
  const query = cliOptions.reviews ? reviewsQuery : pullRequestsQuery;

  return client.query(query, cliOptions, (req, res) => {
    if (res.status === 401) {
      throw new Error('Not authorized');
    }
  });
};

const request = cliOptions => {
  const searchQueryString = constructSearchQueryString(cliOptions);

  // TODO: clean up function
  return getData(searchQueryString)
    .then(responseBody => {
      const mappedData = mapData(cliOptions, responseBody);
      const { hasPreviousPage, hasNextPage, endCursor } = responseBody.data.search.pageInfo;

      // TODO: clean up save and print calls
      saveCsv(cliOptions, cliOptions.reviews ? mappedData : responseBody, {
        header: !hasPreviousPage,
      });
      printTable(mappedData);

      if (hasNextPage) {
        request({ ...cliOptions, after: endCursor });
      } else {
        console.log('File saved to ./prdata.csv');
      }
    })
    .catch(err => {
      console.log(err.message);
    });
};

module.exports = request;
