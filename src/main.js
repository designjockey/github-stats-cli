const client = require('./graphqlClient');
const { getMappedPrData, filterByAuthor } = require('./dataTransformations');
const { printTable } = require('./utils');
const { pullRequestsQuery, prSearchQuery } = require('./queries');

const fs = require('fs');
// const Json2csvTransform = require('json2csv').Transform;
const json2csv = require('json2csv').parse;
// const fields = ['field1', 'field2', 'field3'];
// const opts = { fields };
// const transformOpts = { highWaterMark: 16384, encoding: 'utf-8' };

// const input = fs.createReadStream(inputPath, { encoding: 'utf8' });
// const output = fs.createWriteStream(outputPath, { encoding: 'utf8' });
// const json2csv = new Json2csvTransform(opts, transformOpts);

// const processor = input.pipe(json2csv).pipe(output);

// You can also listen for events on the conversion and see how the header or the lines are coming out.
// json2csv
//   .on('header', header => console.log(header))
//   .on('line', line => console.log(line))
//   .on('error', err => console.log(err));

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
  'labels.nodes.name',
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
  // console.log(params);
  return client.query(prSearchQuery, params, (req, res) => {
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

    console.log('File saved!');
  });
};

const saveCsv = (data, options) => {
  // const fields = Object.keys(data[0]);
  const opts = { fields, ...options };
  console.log(options);

  try {
    const csv = json2csv(data, opts);
    appendToFile(`\n${csv}`);
    console.log(csv);
  } catch (err) {
    console.error(err);
  }
};

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

  getData(params)
    .then(body => {
      const mappedData = getMappedPrData(body);
      // console.log(mappedData);
      const { hasNextPage, endCursor } = body.data.search.pageInfo;
      // const { author: queriedAuthor } = queryParams;

      // if (queriedAuthor) {
      //   printTable(filterByAuthor(mappedData, queriedAuthor));
      // } else {
      // console.log(mappedData[0].pageInfo.hasNextPage);

      if (hasNextPage) {
        // console.log('PAGINATE', pageInfo.endCursor);
        request({ ...queryParams, after: endCursor });
      }

      console.log('hasnextpage', hasNextPage);
      // saveCsv(mappedData);
      saveCsv(body.data.search.nodes);
      printTable(mappedData);

      // }
    })
    .catch(err => {
      console.log(err.message);
    });
};

module.exports = request;
