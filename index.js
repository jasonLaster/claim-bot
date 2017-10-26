const handlePullRequestChange = require("./_src/handle-pull-request-change");
const handleIssueComment = require("./_src/handle-issue-comment");
const handleIssueClose = require("./_src/handle-issue-close");
const handleIssueOpen = require("./_src/handle-issue-open");
const handleIssueLabel = require("./_src/handle-issue-label");
/*
 * docs: https://octokit.github.io/node-github/#api-users-getOrgMemberships
 * webhooks: https://developer.github.com/webhooks/
 */

function probotPlugin(robot) {
  console.log("YOOO");

  // robot.on('pull_request.opened', handlePullRequestChange.bind(null, robot))
  // robot.on('pull_request.edited', handlePullRequestChange.bind(null, robot))
  robot.on("issue_comment.created", handleIssueComment.bind(null, robot));

  // robot.on('membership.added', handleNewMemberAdd.bind(null, robot))
  robot.on("issues.closed", handleIssueClose.bind(null, robot));
  robot.on("issues.opened", handleIssueOpen.bind(null, robot));
  robot.on("issues", handleIssueOpen.bind(null, robot));

  robot.on("issues.label", handleIssueLabel.bind(null, robot));
}

module.exports = probotPlugin;
