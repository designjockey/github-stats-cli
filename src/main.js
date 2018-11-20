const client = require('./graphqlClient');
const { getMappedPrData } = require('./dataTransformations');
const { appendToFile, constructSearchQueryString, printTable } = require('./utils');
const { pullRequestsQuery } = require('./queries');
const json2csv = require('json2csv').parse;

const getData = params => {
  return client.query(pullRequestsQuery, params, (req, res) => {
    if (res.status === 401) {
      throw new Error('Not authorized');
    }
  });
};

const saveCsv = (data, options) => {
  const fields = [
    'number',
    'permalink',
    'createdAt',
    'closedAt',
    'mergedAt',
    'merged',
    'title',
    'lastEditedAt',
    'additions',
    'deletions',
    'changedFiles',
    'commits.totalCount',
    'comments.totalCount',
    'author.login',
  ];

  try {
    const csv = json2csv(data, { fields, ...options });

    appendToFile(csv);
  } catch (err) {
    console.error(err);
  }
};

const request = queryParams => {
  const searchQueryString = constructSearchQueryString(queryParams);

  return getData(searchQueryString)
    .then(body => {
      const mappedData = getMappedPrData(body);
      const { hasPreviousPage, hasNextPage, endCursor } = body.data.search.pageInfo;

      saveCsv(body.data.search.nodes, { header: !hasPreviousPage });
      printTable(mappedData);

      if (hasNextPage) {
        request({ ...queryParams, after: endCursor });
      } else {
        console.log('File saved to ./prdata.csv');
      }
    })
    .catch(err => {
      console.log(err.message);
    });
};

module.exports = request;
