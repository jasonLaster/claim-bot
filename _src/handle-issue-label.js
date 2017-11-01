module.exports = handleIssueLabel

async function handleIssueLabel(robot, context) {
  const issue        = context.payload.issue
  const addedLabel   = context.payload.label
  const api          = context.github
  //const comments  	 = require("./utils/comments.js")
  
  // only handle enhancement label at this time
  if(addedLabel.name != 'enhancement') return

  // - close the issue
	// ?? asked in probot slack how to

    // - create card 
    const cardContent = {
    	note:
    		issue.title + " " +
    		issue.url + " " +
    		issue.number,
    	content_id: issue.id,  // ?? id refers to issue id or number
    	content_type: "issue"
    }
    console.log(cardContent)
    // - select board
    // - add card to board
  
    // - issue closing comment
    // api.issues.createComment(context.issue({body:comments.enhancementClose}))
}