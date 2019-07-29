const json2csv = require('json2csv').parse;
const saveCsv = require('../../src/fileUtils');
const fs = require('fs');

const reviewData = [
  { reviewDate: '2018-09-27', reviewer: 'sophiebits', totalReviews: 3, totalReviewComments: 6 },
  { reviewDate: '2018-09-28', reviewer: 'acdlite', totalReviews: 1, totalReviewComments: 0 },
];

jest.mock('fs', () => ({
  appendFile: jest.fn(),
}));

describe('src/fileUtils', () => {
  beforeEach(() => {
    window.Date.now = jest.fn(() => '2018-05-30T23:23:53Z');
  });

  describe('#saveCsv', () => {
    test('saves reviews data to file', () => {
      saveCsv({ reviews: true }, reviewData, { header: true });

      expect(fs.appendFile).toHaveBeenCalledWith(
        './prdata.csv',
        json2csv(reviewData),
        expect.any(Function)
      );
    });
  });
});
