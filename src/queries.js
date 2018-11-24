/* istanbul ignore file */
const pullRequestsQuery = `
query searchMergedPrsQuery($after: String, $num: Int!, $query: String!) {
    search (first: $num, type:ISSUE, after: $after, query: $query) {
      pageInfo {
        hasPreviousPage,
        hasNextPage,
        startCursor,
        endCursor
      }
      nodes {
        ... on PullRequest {
          number
          permalink
          createdAt
          closedAt
          mergedAt
          merged
          title
          lastEditedAt
          additions
          deletions
          changedFiles
          commits {
            totalCount
          }
          comments {
            totalCount
          }
          author {
            login
          }
        }
      }
    }
  }
`;

const reviewsQuery = `
query searchMergedPrsQuery($after: String, $num: Int!, $query: String!) {
    search (first: $num, type:ISSUE, after: $after, query: $query) {
      pageInfo {
        hasPreviousPage,
        hasNextPage,
        startCursor,
        endCursor
      }
      nodes {
        ... on PullRequest {
          reviews(first: 20) {
            totalCount
            edges {
              node {
                author {
                  login
                },
                state,
                comments {
                  totalCount,
                }
              }
            }
          }
        }
      }
    }
  }
`;

module.exports = {
  pullRequestsQuery,
  reviewsQuery,
};
