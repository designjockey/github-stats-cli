const utils = require('../../src/utils');
const Table = require('easy-table');

describe('src/utils', () => {
  beforeEach(() => {
    window.Date.now = jest.fn(() => '2018-05-30T23:23:53Z');
  });

  describe('#getRelativeDate', () => {
    test('returns number of days passed', () => {
      expect(utils.getRelativeDate('2018-05-20T23:23:53Z')).toEqual('10 days ago');
    });

    test('returns hyphen when no date is passed', () => {
      expect(utils.getRelativeDate()).toEqual('-');
    });
  });

  describe('#getHoursOpen', () => {
    test('returns number of hours passed between 2 dates', () => {
      expect(utils.getHoursOpen('2018-05-20T23:23:53Z', '2018-05-25T23:40:09Z')).toEqual(
        120.27111111111111
      );
    });
  });

  describe('#printTable', () => {
    Table.print = jest.fn();
    window.console.log = jest.fn();

    test('calls print with data', () => {
      const tableData = [
        {
          hello: 'Table',
          world: 'Data',
        },
      ];

      utils.printTable(tableData);

      expect(window.console.log).toHaveBeenCalled();
      expect(Table.print).toHaveBeenCalledWith(tableData);
    });
  });

  describe('#getFromDate', () => {
    test('returns YYYY-MM-DD format of date 7 days ago', () => {
      expect(utils.getFromDate()).toEqual('2018-05-23');
    });
  });

  describe('#getToDate', () => {
    test('returns YYYY-MM-DD format of present day', () => {
      expect(utils.getToDate()).toEqual('2018-05-30');
    });
  });
});
