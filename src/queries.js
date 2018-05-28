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

module.exports = {
  pullRequestsQuery
};
