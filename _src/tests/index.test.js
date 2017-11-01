const { getPayload, tests } = require("./helpers");

function getComment(body) {
  const comment = require(`./fixtures/issue_comment.created.json`);
  comment.payload.comment.body = body;
  return comment;
}

const APIS = {
  issue_comment: {
    created: [
      "issues.addLabels",
      "issues.removeLabel",
      "issues.removeAssigneesFromIssue",
      "issues.addAssigneesToIssue",
      "issues.createComment",
      "orgs.getTeamMembership",
      "orgs.addTeamMembership"
    ]
  },
  issue: {
    closed: ["issues.removeLabel"],
    opened: ["issues.addLabels"]
  }
};

const opened = getPayload("issue.opened");
const closed = getPayload("issue.closed");
const claimed = getComment("/claim");
const unclaimed = getComment("/unclaim");

tests("Claim Bot", { APIS, log: false }, [
  {
    name: "issue closed",
    actions: ["issue.closed"],
    events: [closed]
  },
  {
    name: "issue opened",
    actions: ["issue.opened"],
    events: [opened]
  },
  {
    name: "claimed",
    actions: ["issue_comment.created"],
    events: [claimed]
  },
  {
    name: "claimed, unclaimed",
    actions: ["issue_comment.created"],
    events: [claimed, unclaimed]
  },
  {
    name: "opened, claimed",
    actions: ["issue.opened", "issue_comment.created"],
    events: [opened, unclaimed]
  }
]);