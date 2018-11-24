const { getRelativeDate, getHoursOpen } = require('./utils');

const mapData = (queryParams, responseBody) => {
  console.log(queryParams);
  return queryParams.reviews ? getMappedReviewData(responseBody) : getMappedPrData(responseBody);
};

const getMappedReviewData = ({ data: { search: { pageInfo, nodes = [] } = {} } = {} } = {}) => {
  const reviews = nodes.reduce((acc, node) => [...acc, ...node.reviews.edges], []);
  const reviewCounts = reviews.reduce((reviewerData, { node: review }) => {
    const {
      author: { login: reviewer },
      comments: { totalCount: totalComments },
    } = review;

    return {
      ...reviewerData,
      [reviewer]: {
        totalReviews: reviewerData[reviewer] ? reviewerData[reviewer].totalReviews + 1 : 1,
        totalComments: reviewerData[reviewer]
          ? reviewerData[reviewer].totalComments + totalComments
          : totalComments,
      },
    };
  }, {});

  console.log(reviewCounts);
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
