# github-stats-cli

Github CLI to fetch stats

## Installation

```
$ npm install -g github-stats-cli
```

After installing the package [generate a Github token](https://github.com/settings/tokens) with `repo` level access and set the environment variable
by using:

```
echo 'export GH_STATS_TOKEN=<your token>' >> ~/.bash_profile
```

This token will be used by the cli to interface with the Github API.

## Usage
```
  Usage: github-stats-cli [options]

  Options:
    -v, --version          output the version number
    -o, --org <org>        required github repo org name
    -r, --repo <repo>      required github repo name
    -u, --user <user>      optional author name
    -n, --num <num>        optional number of pull requests to return (default: 10)
    -s, --states <states>  comma separated MERGED|CLOSED|OPEN (default: OPEN)
    -h, --help             output usage information

  Environment variables:
    
    GH_STATS_TOKEN  set export GH_STATS_TOKEN=<your generated github token>
    
  Examples:
    
    Minimal usage - get last 10 PRs from facebook/react that are currently open:
    
      $ github-stats-cli -o facebook -r react
    
    Get last 20 PRs that are currently merged, closed or open:
    
      $ github-stats-cli -o facebook -r react -n 20 -s MERGED,CLOSED,OPEN
    
    Get last 20 closed PRs and return only the ones that match user name bvaughn:
    
      $ github-stats-cli -o facebook -r react -n 20 -s MERGED -u bvaughn
```
