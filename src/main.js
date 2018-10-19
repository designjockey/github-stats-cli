const client = require('./graphqlClient');
const { getMappedPrData, filterByAuthor } = require('./dataTransformations');
const { printTable } = require('./utils');
const { pullRequestsQuery, prSearchQuery } = require('./queries');

const getSearchQueryString = params => {
  const { org, repo, state, fromDate, toDate, author } = params;

  return {
    ...params,
    query: `repo:${org}/${repo} type:pr is:${state} created:>=${fromDate} merged:<=${toDate}${
      author ? ` author:${author}` : ''
    }`,
  };
};

module.exports = queryParams => {
  const params = getSearchQueryString(queryParams);

  console.log('PARAMS', params);
  client
    .query(prSearchQuery, params, (req, res) => {
      if (res.status === 401) {
        throw new Error('Not authorized');
      }
    })
    .then(body => {
      console.log(body);
      const mappedData = getMappedPrData(body);
      // const { author: queriedAuthor } = queryParams;

      // if (queriedAuthor) {
      //   printTable(filterByAuthor(mappedData, queriedAuthor));
      // } else {
      printTable(mappedData);
      // }
    })
    .catch(err => {
      console.log(err.message);
    });
};
