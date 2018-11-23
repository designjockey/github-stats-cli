const Table = require('easy-table');
const moment = require('moment');
const fs = require('fs');

const getRelativeDate = date => (date ? moment(date).fromNow() : '-');

const getHoursOpen = (fromDate, toDate) => moment(toDate).diff(fromDate, 'hours', true);

const getFromDate = () =>
  moment()
    .subtract(7, 'd')
    .format('YYYY-MM-DD');

const getToDate = () => moment().format('YYYY-MM-DD');

const printTable = tableData => {
  console.log(Table.print(tableData));
};

const constructSearchQueryString = (params = {}) => {
  const { org, repo, state, fromDate, toDate, author } = params;

  return {
    ...params,
    query: `repo:${org}/${repo} type:pr is:${state} created:>=${fromDate} merged:<=${toDate}${
      author ? ` author:${author}` : ''
    }`,
  };
};

const appendToFile = (fileContent, filePathWithName = './prdata.csv') => {
  fs.appendFile(filePathWithName, fileContent, err => {
    if (err) {
      throw err;
    }
  });
};

module.exports = {
  getRelativeDate,
  getHoursOpen,
  getFromDate,
  getToDate,
  printTable,
  constructSearchQueryString,
  appendToFile,
};
