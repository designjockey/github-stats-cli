#!/usr/bin/env node

const program = require('commander');
const colors = require('colors');
const app = require('./package.json');
const { getFromDate, getToDate } = require('./src/utils');
const getStats = require('./src/main');

const [cmdString] = Object.keys(app.bin);
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
    Minimal usage - get PRs from facebook/react repo merged in last 7 days, paginate 10 at a time and save to ./prdata.csv:
    \n
      $ ${cmdString} -o facebook -r react
    \n
    Get PRs from facebook/react repo merged in last 7 days, paginate 20 at a time and save to ./prdata.csv:
    \n
      $ ${cmdString} -o facebook -r react -n 20
    \n
    Get PRs from facebook/react repo created on or after 2018-07-01 merged on or before 2018-09-30, paginate 20 at a time and save to ./prdata.csv:
    \n
      $ ${cmdString} -o facebook -r react -n 20 -u bvaughn -f 2018-07-01 -t 2018-09-30
    \n
  `)
  );
});

program
  .version(app.version, '-v, --version')
  .option('-o, --org <org>', 'required github repo org name')
  .option('-r, --repo <repo>', 'required github repo name')
  .option('-u, --user <user>', 'optional author name', undefined)
  .option('-n, --num <num>', 'optional number of pull requests to return per page', defaults.num)
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
  state: defaults.state,
  fromDate: program.from,
  toDate: program.to,
};

getStats(queryParams);
