const { getRelativeDate, getHoursOpen } = require('./utils');

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
  getMappedPrData,
};
