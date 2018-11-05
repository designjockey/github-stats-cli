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
  Usage: ghs [options]

  Options:
    -v, --version      output the version number
    -o, --org <org>    required github repo org name
    -r, --repo <repo>  required github repo name
    -u, --user <user>  optional author name
    -n, --num <num>    optional number of pull requests to return per page (default: 10)
    -f, --from <from>  YYYY-MM-DD date, e.g. 2018-12-21 (default: "2018-10-29")
    -t, --to <to>      YYYY-MM-DD date, e.g. 2018-12-25 (default: "2018-11-05")
    -h, --help         output usage information

  Environment variables:

    GH_STATS_TOKEN  set export GH_STATS_TOKEN=<your generated github token>

  Examples:

    Minimal usage - get PRs from facebook/react repo merged in last 7 days, paginate 10 at a time and save to ./prdata.csv:

      $ ghs -o facebook -r react

    Get PRs from facebook/react repo merged in last 7 days, paginate 20 at a time and save to ./prdata.csv:

      $ ghs -o facebook -r react -n 20

    Get PRs from facebook/react repo created on or after 2018-07-01 merged on or before 2018-09-30, paginate 20 at a time and save to ./prdata.csv:

      $ ghs -o facebook -r react -n 20 -u bvaughn -f 2018-07-01 -t 2018-09-30
```
