const client = require('./graphqlClient');
const { getMappedPrData } = require('./dataTransformations');
const { printTable } = require('./utils');
const { pullRequestsQuery } = require('./queries');
const fs = require('fs');
const json2csv = require('json2csv').parse;

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

const getSearchQueryString = params => {
  const { org, repo, state, fromDate, toDate, author } = params;

  return {
    ...params,
    query: `repo:${org}/${repo} type:pr is:${state} created:>=${fromDate} merged:<=${toDate}${
      author ? ` author:${author}` : ''
    }`,
  };
};

const getData = params => {
  return client.query(pullRequestsQuery, params, (req, res) => {
    if (res.status === 401) {
      throw new Error('Not authorized');
    }
  });
};

const appendToFile = (fileContent, filePathWithName = './prdata.csv') => {
  fs.appendFile(filePathWithName, fileContent, err => {
    if (err) {
      throw err;
    }

    // console.log('File saved!');
  });
};

const saveCsv = (data, options) => {
  const opts = { fields, ...options };

  try {
    const csv = json2csv(data, opts);
    appendToFile(csv);
  } catch (err) {
    console.error(err);
  }
};

const request = queryParams => {
  const params = getSearchQueryString(queryParams);

  getData(params)
    .then(body => {
      const mappedData = getMappedPrData(body);
      const { hasPreviousPage, hasNextPage, endCursor } = body.data.search.pageInfo;

      if (hasNextPage) {
        request({ ...queryParams, after: endCursor });
      }

      saveCsv(body.data.search.nodes, { header: !hasPreviousPage });
      printTable(mappedData);
    })
    .catch(err => {
      console.log(err.message);
    });
};

module.exports = request;
