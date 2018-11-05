const utils = require('../../src/utils');
const Table = require('easy-table');
const fs = require('fs');

jest.mock('fs', () => ({
  appendFile: jest.fn(),
}));

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

  describe('#constructSearchQueryString', () => {
    const params = {
      org: 'facebook',
      repo: 'react',
      state: 'merged',
      fromDate: '2018-01-01',
      toDate: '2018-01-02',
      foo: 'bar',
    };

    test('returns query without author', () => {
      expect(utils.constructSearchQueryString(params)).toMatchObject({
        ...params,
        query: 'repo:facebook/react type:pr is:merged created:>=2018-01-01 merged:<=2018-01-02',
      });
    });

    test('returns query with author', () => {
      const paramsWithAuthor = { ...params, author: 'authorName' };

      expect(utils.constructSearchQueryString({ ...paramsWithAuthor })).toMatchObject({
        ...paramsWithAuthor,
        query:
          'repo:facebook/react type:pr is:merged created:>=2018-01-01 merged:<=2018-01-02 author:authorName',
      });
    });
  });

  describe('#appendToFile', () => {
    test('calls appendFile', () => {
      const fileContent = 'fileContentText';
      const fileName = './prdata.csv';

      utils.appendToFile(fileContent, fileName);

      expect(fs.appendFile).toHaveBeenCalledWith(fileName, fileContent, expect.any(Function));
    });
  });
});
