// removes selected labels from closed issues
async function handleIssueClose(robot, context) {
  const api = context.github;

  api.issues.removeLabel(context.issue({ name: "in progress" }));
  api.issues.removeLabel(context.issue({ name: "available" }));
}

module.exports = handleIssueClose;
