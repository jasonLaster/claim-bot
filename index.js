module.exports = probotPlugin

const handleIssueComment        = require('./lib/handle-issue-comment')
const handleIssueClose          = require('./lib/handle-issue-close')
const handleIssueOpen           = require('./lib/handle-issue-open')
const handleIssueLabel          = require('./lib/handle-issue-label')

/*
 * docs: https://octokit.github.io/node-github/#api-users-getOrgMemberships
 * webhooks: https://developer.github.com/webhooks/
 */

function probotPlugin (robot) {
  
  // robot.on('membership.added', handleNewMemberAdd.bind(null, robot))
  
  robot.on('issue_comment.created', handleIssueComment.bind(null, robot))
  robot.on('issues.closed', handleIssueClose.bind(null, robot))
  robot.on('issues.opened', handleIssueOpen.bind(null, robot))
  robot.on('issues.labeled', handleIssueLabel.bind(null, robot))
}
