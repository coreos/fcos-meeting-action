import * as core from '@actions/core'
import octo from '@octokit/rest'
export async function GetMeetingTopics(): Promise<string> {
  try {
    const octokit = new octo.Octokit({
      auth: process.env.GITHUB_TOKEN
    })
    
    var issues = await octokit.issues.listForRepo({
      owner: 'coreos',
      repo: 'fedora-coreos-tracker',
      labels: 'meeting-topic',
      state: 'open'
    })

    var issuesToBeDiscussed = ""
    for (var i = 0; i < issues.data.length; i++) {
      issuesToBeDiscussed += "- [ ] #topic " + issues.data[i].title + "\n"
      issuesToBeDiscussed += "- #link " + issues.data[i].url + "\n"
    }
    return issuesToBeDiscussed

  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
    return "#topic No meeting topics found."
}