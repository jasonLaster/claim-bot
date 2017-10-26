const { createRobot } = require("probot");
const app = require("../../index");
function getPayload(name) {
  return require(`./fixtures/${name}.json`);
}

describe("your-app", () => {
  let robot;
  let github;

  beforeEach(() => {
    robot = createRobot();
    app(robot);

    github = {
      issues: {
        createComment: jest.fn().mockReturnValue(Promise.resolve({})),
        removeLabel: jest.fn().mockReturnValue(Promise.resolve({}))
      }
    };
    // Passes the mocked out GitHub API into out robot instance
    robot.auth = () => Promise.resolve(github);
  });

  describe("your functionality", () => {
    it("performs an action", async () => {
      const payload = getPayload("issue-reopened");

      await robot.receive(payload);

      console.log(github.issues.removeLabel.mock.calls);
      expect(github.issues.removeLabel.mock.calls).toEqual(2);
    });
  });
});
