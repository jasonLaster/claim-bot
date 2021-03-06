module.exports = handleIssueOpen;

// adds not-available label to new issues
async function handleIssueOpen(robot, context) {
  const api = context.github;
  
  api.issues.addLabels(context.issue({ labels: ["not-available"] }));
}