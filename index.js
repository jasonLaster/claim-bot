const handleIssueComment = require("./_src/handle-issue-comment");
const handleIssueClose = require("./_src/handle-issue-close");
const handleIssueOpen = require("./_src/handle-issue-open");
const handleIssueLabel = require("./_src/handle-issue-label");
/*
 * docs: https://octokit.github.io/node-github/#api-users-getOrgMemberships
 * webhooks: https://developer.github.com/webhooks/
 */

function probotPlugin(robot) {
  robot.on("issue_comment.created", handleIssueComment.bind(null, robot));

  robot.on("issue.closed", handleIssueClose.bind(null, robot));
  robot.on("issue.opened", handleIssueOpen.bind(null, robot));
  // robot.on("issue", handleIssueOpen.bind(null, robot));
  // robot.on('membership.added', handleNewMemberAdd.bind(null, robot))

  robot.on("issues.labeled", handleIssueLabel.bind(null, robot));
}

module.exports = probotPlugin;