const { createRobot } = require("probot");
const app = require("../../index");
const _ = require("lodash");
const cases = require("jest-in-case");
const chalk = require("chalk");

function getPayload(name) {
  return require(`./fixtures/${name}.json`);
}

function createGithub(APIS, api) {
  github = {};
  api.forEach(action => {
    _.set(github, action, jest.fn().mockReturnValue(Promise.resolve({})));
  });
  return github;
}

function getCalls(github, APIS, api) {
  return api.reduce(
    (calls, event) =>
      _.merge(calls, _.set({}, event, getCallsForEvent(github, event))),
    {}
  );
}

function getCallsForEvent(github, event) {
  return _.get(github, event).mock.calls;
}

function formatCallsForEvent(github, event) {
  return getCallsForEvent(github, event)
    .map(call => chalk.dim(`${JSON.stringify(call, null, 2)}`))
    .join("\n");
}

function formatEvent(github, event) {
  return chalk`{green Calls: ${event}}\n${formatCallsForEvent(github, event)}`;
}

function formatAction(github, APIS, action) {
  const api = _.get(APIS, action);
  const out = api.map(event => formatEvent(github, event));

  return chalk`{blue Action: ${action}}\n${out.join("\n")}`;
}

function formatCalls(github, APIS, actions, name) {
  const out = actions.map(action => formatAction(github, APIS, action));
  console.log(chalk`{yellow Test: ${name}}\n${out.join("\n")}`);
}

function test({ APIS, log }) {
  return async ({ name, actions, events }) => {
    const api = _.uniq(_.flatten(actions.map(action => _.get(APIS, action))));

    let github = createGithub(APIS, api);

    const robot = createRobot();
    app(robot);
    robot.auth = () => Promise.resolve(github);

    for (event of events) {
      await robot.receive(event);
    }

    if (log) {
      formatCalls(github, APIS, actions, name);
    }

    expect(getCalls(github, APIS, api)).toMatchSnapshot();
  };
}

function tests(name, options, scenarios) {
  cases(name, test(options), scenarios);
}

module.exports = {
  getPayload,
  getCalls,
  tests
};
