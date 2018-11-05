const { getMappedPrData } = require('../../src/dataTransformations');

describe('#getMappedPrData', () => {
  test('returns empty array when no data is returned', () => {
    expect(getMappedPrData()).toEqual([]);
  });

  test('returns transformed data to display in table in console', () => {
    expect(
      getMappedPrData({
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
      })
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
});
