const { appendToFile } = require('./utils');
const json2csv = require('json2csv').parse;

const saveCsv = (cliOptions, data, options) =>
  cliOptions.reviews ? saveReviewData(data, options) : savePrData(data, options);

const saveReviewData = (mappedData, options) => {
  if (mappedData) {
    try {
      const csv = json2csv(mappedData);

      appendToFile(csv);
    } catch (err) {
      console.error(err);
    }
  }
};

const savePrData = (responseBody, options) => {
  const data = responseBody.data.search.nodes;
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
module.exports = saveCsv;
