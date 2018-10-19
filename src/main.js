const client = require('./graphqlClient');
const { getMappedPrData, filterByAuthor } = require('./dataTransformations');
const { printTable } = require('./utils');
const { pullRequestsQuery, prSearchQuery } = require('./queries');

const getSearchQueryString = params => {
  const { org, repo, state, fromDate, toDate, author } = params;

  return {
    ...params,
    query: `repo:${org}/${repo} type:pr is:${state} created:>=${fromDate} merged:<=${toDate}${
      author ? ` author:${author}` : ''}`
  };
};

const getData = (params) => {
  // console.log(params);
  return client
    .query(prSearchQuery, params, (req, res) => {
      if (res.status === 401) {
        throw new Error('Not authorized');
      }
    });
}

const request = queryParams => {
  const params = getSearchQueryString(queryParams);
  // console.log('request');
  // console.log('PARAMS', params);
  // client
  //   .query(prSearchQuery, params, (req, res) => {
  //     if (res.status === 401) {
  //       throw new Error('Not authorized');
  //     }
  //   })
  getData(params).then(body => {
    const mappedData = getMappedPrData(body);
    // console.log(mappedData);
    const { pageInfo } = body.data.search;
    // const { author: queriedAuthor } = queryParams;

    // if (queriedAuthor) {
    //   printTable(filterByAuthor(mappedData, queriedAuthor));
    // } else {
    // console.log(mappedData[0].pageInfo.hasNextPage);

    if (pageInfo.hasNextPage) {
      // console.log('PAGINATE', pageInfo.endCursor);
      request({ ...queryParams, after: pageInfo.endCursor });
    }

    printTable(mappedData);

    // }
  })
    .catch(err => {
      console.log(err.message);
    });
};

module.exports = request;
