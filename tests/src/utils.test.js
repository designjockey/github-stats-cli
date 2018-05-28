const utils = require('../../src/utils');
const Table = require('easy-table');

describe('src/utils', () => {
  describe('#getRelativeDate', () => {
    test('returns number of days passed', () => {
      window.Date.now = jest.fn(() => '2018-05-30T23:23:53Z');

      expect(utils.getRelativeDate('2018-05-20T23:23:53Z')).toEqual('10 days ago');
    });

    test('returns hyphen when no date is passed', () => {
      expect(utils.getRelativeDate()).toEqual('-');
    });
  });

  describe('#getDaysOpen', () => {
    test('returns number of days passed between 2 dates', () => {
      expect(utils.getDaysOpen('2018-05-20T23:23:53Z', '2018-05-25T23:40:09Z')).toEqual(5);
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

  describe('#normalizeStates', () => {
    test('returns single value', () => {
      expect(utils.normalizeStates('HELLO')).toEqual(['HELLO']);
    });

    test('returns array from comma separated string and removes spaces', () => {
      expect(utils.normalizeStates('HELLO, WORLD')).toEqual(['HELLO', 'WORLD']);
    });

    test('returns array from comma separated string', () => {
      expect(utils.normalizeStates('HELLO,WORLD')).toEqual(['HELLO', 'WORLD']);
    });

    test('returns array from empty string', () => {
      expect(utils.normalizeStates('')).toEqual(['']);
    });
  });
});
