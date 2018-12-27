const { mapData } = require('../../src/dataTransformations');

const reviewsData = [
  {
    reviews: {
      edges: [
        {
          node: {
            createdAt: '2018-09-27T21:31:43Z',
            author: { login: 'sophiebits' },
            comments: { totalCount: 4 },
          },
        },
        {
          node: {
            createdAt: '2018-09-27T21:41:25Z',
            author: { login: 'sophiebits' },
            comments: { totalCount: 1 },
          },
        },
        {
          node: {
            createdAt: '2018-09-27T22:10:20Z',
            author: { login: 'acdlite' },
            comments: { totalCount: 1 },
          },
        },
        {
          node: {
            createdAt: '2018-09-27T22:10:41Z',
            author: { login: 'acdlite' },
            comments: { totalCount: 1 },
          },
        },
        {
          node: {
            createdAt: '2018-09-27T22:11:00Z',
            author: { login: 'acdlite' },
            comments: { totalCount: 1 },
          },
        },
        {
          node: {
            createdAt: '2018-09-27T22:15:11Z',
            author: { login: 'sophiebits' },
            comments: { totalCount: 1 },
          },
        },
      ],
    },
  },
  {
    reviews: {
      edges: [
        {
          node: {
            createdAt: '2018-09-27T20:27:21Z',
            author: { login: 'bvaughn' },
            comments: { totalCount: 1 },
          },
        },
        {
          node: {
            createdAt: '2018-09-27T20:27:57Z',
            author: { login: 'bvaughn' },
            comments: { totalCount: 1 },
          },
        },
        {
          node: {
            createdAt: '2018-09-27T20:29:02Z',
            author: { login: 'bvaughn' },
            comments: { totalCount: 1 },
          },
        },
        {
          node: {
            createdAt: '2018-09-27T23:22:08Z',
            author: { login: 'acdlite' },
            comments: { totalCount: 1 },
          },
        },
        {
          node: {
            createdAt: '2018-09-27T23:27:40Z',
            author: { login: 'acdlite' },
            comments: { totalCount: 1 },
          },
        },
        {
          node: {
            createdAt: '2018-09-28T15:26:07Z',
            author: { login: 'bvaughn' },
            comments: { totalCount: 1 },
          },
        },
        {
          node: {
            createdAt: '2018-09-28T19:51:47Z',
            author: { login: 'acdlite' },
            comments: { totalCount: 0 },
          },
        },
      ],
    },
  },
  {
    reviews: {
      edges: [
        {
          node: {
            createdAt: '2018-09-27T11:21:37Z',
            author: { login: 'gaearon' },
            comments: { totalCount: 1 },
          },
        },
        {
          node: {
            createdAt: '2018-09-27T14:55:56Z',
            author: { login: 'bvaughn' },
            comments: { totalCount: 1 },
          },
        },
        {
          node: {
            createdAt: '2018-09-27T14:58:55Z',
            author: { login: 'bvaughn' },
            comments: { totalCount: 1 },
          },
        },
        {
          node: {
            createdAt: '2018-09-27T17:29:07Z',
            author: { login: 'acdlite' },
            comments: { totalCount: 1 },
          },
        },
      ],
    },
  },
];

describe('#mapData', () => {
  test('returns empty array when no data is returned', () => {
    expect(mapData()).toEqual([]);
  });

  test('returns transformed data for pull requests to display in console table', () => {
    window.Date.now = jest.fn(() => '2018-10-28T23:23:53Z');

    expect(
      mapData(
        {},
        {
          data: {
            search: {
              pageInfo: {},
              nodes: [
                {
                  merged: true,
                  author: {
                    login: 'username',
                  },
                  createdAt: '2018-05-28T23:23:53Z',
                  lastEditedAt: '',
                  mergedAt: '2018-05-30T23:23:53Z',
                  permalink: 'http://somelink.com/to/pr',
                },
              ],
            },
          },
        }
      )
    ).toEqual([
      {
        author: 'username',
        createdAt: '5 months ago',
        hoursOpen: '48.00',
        lastEditedAt: '-',
        merged: true,
        mergedAt: '5 months ago',
        permalink: 'http://somelink.com/to/pr',
      },
    ]);
  });

  test('returns reviews data', () => {
    window.Date.now = jest.fn(() => '2018-10-28T23:23:53Z');

    expect(
      mapData(
        {
          reviews: true,
        },
        {
          data: {
            search: {
              pageInfo: {},
              nodes: reviewsData,
            },
          },
        }
      )
    ).toEqual([
      { reviewDate: '2018-09-27', reviewer: 'sophiebits', totalReviewComments: 6, totalReviews: 3 },
      { reviewDate: '2018-09-27', reviewer: 'acdlite', totalReviewComments: 6, totalReviews: 6 },
      { reviewDate: '2018-09-27', reviewer: 'bvaughn', totalReviewComments: 5, totalReviews: 5 },
      { reviewDate: '2018-09-27', reviewer: 'gaearon', totalReviewComments: 1, totalReviews: 1 },
      { reviewDate: '2018-09-28', reviewer: 'bvaughn', totalReviewComments: 1, totalReviews: 1 },
      { reviewDate: '2018-09-28', reviewer: 'acdlite', totalReviewComments: 0, totalReviews: 1 },
    ]);
  });
});
