module.exports = handleIssueComment;

const comments = require("./utils/comments.js");

function claim(context, message) {
  const api = context.github;
  const labels = context.payload.issue.labels.map(l => l.name);

  api.issues.removeLabel(context.issue({ name: "available" }));
  api.issues.addLabels(context.issue({ labels: ["in progress"] }));
  api.issues.createComment(context.issue({ body: message }));
}

function unclaim(context) {
  const api = context.github;
  const labels = context.payload.issue.labels.map(l => l.name);
  const assignees = context.payload.issue.assignees;

  api.issues.removeLabel(context.issue({ name: "in progress" }));

  if (assignees.length === 0) {
    api.issues.addLabels(context.issue({ labels: ["available"] }));
  }

  api.issues.createComment(context.issue({ body: comments.unclaim }));
}

function assignAuthor(context) {
  const api = context.github;
  const author = context.payload.comment.user.login;

  api.issues.addAssigneesToIssue(context.issue({ assignees: [author] }));
}

function unAssignAuthor(context) {
  const api = context.github;
  const author = context.payload.comment.user.login;

  api.issues.removeAssigneesFromIssue(
    context.issue({ body: { assignees: [author] } })
  );
}

function isAssignee(context) {
  const user = context.payload.comment.user.login;
  const assignees = context.payload.issue.assignees;

  return assignees.find(assignee => {
    return assignee.login == user;
  });
}

function isMember(context) {
  // promise > resolve = member, reject = not member
  const api = context.github;
  const user = context.payload.comment.user.login;
  const teamId = "2521165"; // team "debugger-contributors"

  return api.orgs.getTeamMembership({
    id: teamId,
    username: user
  });
}

function inviteUser(context) {
  const api = context.github;
  const user = context.payload.comment.user.login;
  const teamId = "2521165"; // team "debugger-contributors"

  api.orgs.addTeamMembership({
    id: teamId,
    username: user
  });
}

async function handleIssueComment(robot, context) {
  const api = context.github;
  const commentBody = context.payload.comment.body;
  const assignees = context.payload.issue.assignees;
  const state = context.payload.issue.state;
  const firstLine = commentBody.split("\n")[0];

  // don't (un)claim closed issues
  if (state == "closed") return;

  // claim handle
  if (
    firstLine.match(/[\/]claim/)
    && !isAssignee(context) // stop people from claim spamming
    // && assignees.length === 0 // this prevents new assignees, but do we want that
  ) {
    isMember(context)
      .then(() => {
        assignAuthor(context);
        claim(context, comments.memberClaim);
      })
      .catch(() => {
        inviteUser(context);
        claim(context, comments.newUserClaim);
      });
  } else if (
    firstLine.match(/[\/@#]unclaim/)
    && isAssignee(context) // stop people from unclaim spamming
  ) {
    unAssignAuthor(context);
    return unclaim(context);
  }
} // end handleIssueComment