const { getRelativeDate, getHoursOpen } = require('./utils');
const moment = require('moment');
// const saveCsv = require('./fileUtils');

const dataCollector = [];

const mapData = (cliOptions = {}, responseBody) =>
  cliOptions.reviews ? getMappedReviewData(responseBody) : getMappedPrData(responseBody);

const getMappedReviewData = ({ data: { search: { pageInfo, nodes = [] } = {} } = {} } = {}) => {
  const { hasNextPage } = pageInfo;

  dataCollector.push(...nodes);

  // after all the pageinated data has been pulled into dataCollector, process
  if (!hasNextPage) {
    const reviews = dataCollector.reduce((acc, node) => [...acc, ...node.reviews.edges], []);
    const reviewCountsByDate = reviews.reduce((reviewerData, { node: review }) => {
      const {
        author: { login: reviewer },
        comments: { totalCount: totalComments },
        createdAt,
      } = review;
      const reviewDate = moment(createdAt).format('YYYY-MM-DD');
      const totalReviews =
        reviewerData[reviewDate] && reviewerData[reviewDate][reviewer]
          ? reviewerData[reviewDate][reviewer].totalReviews + 1
          : 1;
      const totalReviewComments =
        reviewerData[reviewDate] && reviewerData[reviewDate][reviewer]
          ? reviewerData[reviewDate][reviewer].totalReviewComments + totalComments
          : totalComments;

      return {
        ...reviewerData,
        [reviewDate]: {
          ...reviewerData[reviewDate],
          [reviewer]: {
            totalReviews,
            totalReviewComments,
          },
        },
      };
    }, {});

    return Object.keys(reviewCountsByDate).reduce((acc, date) => {
      return [
        ...acc,
        ...Object.keys(reviewCountsByDate[date]).map(reviewer => {
          return {
            reviewDate: date,
            reviewer,
            ...reviewCountsByDate[date][reviewer],
          };
        }),
      ];
    }, []);
  }
};

const getMappedPrData = ({ data: { search: { pageInfo, nodes = [] } = {} } = {} } = {}) =>
  nodes.map(node => {
    const {
      merged,
      author: { login },
      createdAt,
      lastEditedAt,
      mergedAt,
      permalink,
    } = node;

    return {
      merged,
      author: login,
      createdAt: getRelativeDate(createdAt),
      lastEditedAt: getRelativeDate(lastEditedAt),
      mergedAt: getRelativeDate(mergedAt),
      permalink,
      hoursOpen: !merged
        ? getHoursOpen(createdAt, Date.now()).toFixed(2)
        : getHoursOpen(createdAt, mergedAt).toFixed(2),
    };
  });

module.exports = {
  mapData,
};
