const pullRequestsQuery = `
  query repo($org: String!, $repo: String!, $num: Int!, $states: [PullRequestState!]) {
    repository(owner: $org, name: $repo) {
      pullRequests(last: $num, states: $states) {
        edges {
          node {
            author {
              login
            },
            title,
            createdAt,
            lastEditedAt,
            mergedAt,
            merged,
            mergeable,
            resourcePath,
          }
        }
      }
    }
  }
`;

const prSearchQuery = `
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
          labels(first:5) {
            nodes {
              name
            }
          }
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

module.exports = {
  pullRequestsQuery,
  prSearchQuery,
};
