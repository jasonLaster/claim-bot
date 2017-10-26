// adds not-available label to new issues
async function handleIssueOpen(robot, context) {
  const api = context.github;

  console.log("YAY");
  api.issues.addLabels(context.issue({ labels: ["not-available"] }));
}
module.exports = handleIssueOpen;
