const Table = require('easy-table');
const moment = require('moment');

const getRelativeDate = date => (date ? moment(date).fromNow() : '-');

const getDaysOpen = (fromDate, toDate) => moment(toDate).diff(fromDate, 'days');

const printTable = tableData => {
  console.log(Table.print(tableData));
};

const normalizeStates = value => {
  return value.replace(/ /g, '').split(',');
};

module.exports = {
  getRelativeDate,
  getDaysOpen,
  normalizeStates,
  printTable,
};
