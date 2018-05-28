const { getRelativeDate, getDaysOpen } = require('./utils');

const getMappedPrData = ({
  data: { repository: { pullRequests: { edges = [] } = {} } = {} } = {},
} = {}) =>
  edges.map(({ node }) => {
    const {
      merged,
      author: { login },
      createdAt,
      lastEditedAt,
      mergedAt,
      resourcePath,
    } = node;

    return Object.assign({}, node, {
      author: login,
      createdAt: getRelativeDate(createdAt),
      lastEditedAt: getRelativeDate(lastEditedAt),
      mergedAt: getRelativeDate(mergedAt),
      resourcePath: `https://github.com${resourcePath}`,
      daysOpen: !merged ? getDaysOpen(createdAt, Date.now()) : getDaysOpen(createdAt, mergedAt),
    });
  });

const filterByAuthor = (data, queriedAuthor) =>
  data.filter(({ author }) => author === queriedAuthor);

module.exports = {
  filterByAuthor,
  getMappedPrData,
};
