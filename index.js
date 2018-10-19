#!/usr/bin/env node

const program = require('commander');
const colors = require('colors');
const app = require('./package.json');
const { normalizeStates, getFromDate, getToDate } = require('./src/utils');
const getStats = require('./src/main');

const defaults = {
  num: 10,
  state: 'merged',
  fromDate: getFromDate(),
  toDate: getToDate(),
};

colors.setTheme({
  help: 'cyan',
  error: 'red',
});

program.on('--help', () => {
  console.log(
    colors.help(`
  Environment variables:
    \n
    GH_STATS_TOKEN  set export GH_STATS_TOKEN=<your generated github token>
    \n
  Examples:
    \n
    Minimal usage - get last 10 PRs from facebook/react that are currently open:
    \n
      $ ${app.name} -o facebook -r react
    \n
    Get last 20 PRs that are currently merged, closed or open:
    \n
      $ ${app.name} -o facebook -r react -n 20 -s MERGED,CLOSED,OPEN
    \n
    Get last 20 closed PRs and return only the ones that match user name bvaughn:
    \n
      $ ${app.name} -o facebook -r react -n 20 -s MERGED -u bvaughn
    \n
  `)
  );
});

program
  .version(app.version, '-v, --version')
  .option('-o, --org <org>', 'required github repo org name')
  .option('-r, --repo <repo>', 'required github repo name')
  .option('-u, --user <user>', 'optional author name', undefined)
  .option('-n, --num <num>', 'optional number of pull requests to return', defaults.num)
  .option('-s, --state <state>', 'merged|closed|open', defaults.state)
  .option('-f, --from <from>', 'YYYY-MM-DD date, e.g. 2018-12-21', defaults.fromDate)
  .option('-t, --to <to>', 'YYYY-MM-DD date, e.g. 2018-12-25', defaults.toDate)
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp(text => colors.help(text));
}

if (!program.org || !program.repo) {
  console.error(colors.error('\n No Github org or repo provided \n'));
  process.exit(1);
}

const queryParams = {
  org: program.org,
  repo: program.repo,
  author: program.user,
  num: Number(program.num),
  state: program.state,
  fromDate: program.from,
  toDate: program.to,
};

getStats(queryParams);
// $after: String, $fromDate: String!, $toDate: String!, $author String
