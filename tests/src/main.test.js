const client = require('../../src/graphqlClient');
const { printTable } = require('../../src/utils');
const request = require('../../src/main');

jest.mock('../../src/utils', () => ({
  appendToFile: jest.fn(),
  constructSearchQueryString: jest.fn(),
  printTable: jest.fn(),
  getRelativeDate: jest.fn(() => '2 days ago'),
  getHoursOpen: jest.fn(() => 10.31211),
}));

describe('src/main', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('request', () => {
    describe('when only 1 page of results', () => {
      beforeEach(() => {
        client.query = jest.fn(() =>
          Promise.resolve({
            data: {
              search: {
                pageInfo: {},
                nodes: [
                  {
                    number: 111,
                    permalink: 'https://some/pull/request/link/111',
                    createdAt: '2018-05-28T23:23:53Z',
                    closedAt: '',
                    mergedAt: '2018-05-30T23:23:53Z',
                    merged: true,
                    title: 'My PR title',
                    lastEditedAt: '',
                    additions: 100,
                    deletions: 10,
                    commits: {
                      totalCount: 2,
                    },
                    comments: {
                      totalCount: 5,
                    },
                    author: {
                      login: 'designjockey',
                    },
                  },
                ],
              },
            },
          })
        );
      });

      test('saves results returned', async () => {
        await request();

        expect(printTable).toHaveBeenCalledWith([
          {
            author: 'designjockey',
            createdAt: '2 days ago',
            hoursOpen: '10.31',
            lastEditedAt: '2 days ago',
            merged: true,
            mergedAt: '2 days ago',
            permalink: 'https://some/pull/request/link/111',
          },
        ]);
        expect(console.log).toHaveBeenCalledWith('File saved to ./prdata.csv');
      });

      test('makes request to API 1 time', async () => {
        await request();

        expect(client.query.mock.calls.length).toBe(1);
      });
    });

    describe('when results are paginated', () => {
      beforeEach(() => {
        client.query = jest.fn().mockReturnValueOnce(
          Promise.resolve({
            data: {
              search: {
                pageInfo: {
                  hasNextPage: true,
                  hasPreviousPage: true,
                  endCursor: 'someEndCursor',
                },
              },
            },
          })
        );
      });

      test('makes another request', async () => {
        await request();

        expect(client.query.mock.calls.length).toBe(2);
      });
    });

    test('throws error when query fails', async () => {
      client.query = jest.fn(() => Promise.reject(Error('error message')));

      await request();

      expect(console.log).toHaveBeenCalledWith('error message');
    });
  });
});
