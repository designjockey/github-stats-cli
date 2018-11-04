const Table = require('easy-table');
const moment = require('moment');

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

module.exports = {
  getRelativeDate,
  getHoursOpen,
  getFromDate,
  getToDate,
  printTable,
};
