import * as core from '@actions/core'
import { Octokit } from 'octokit'
import { OutOfBandTopic } from './meetingTopics'

export interface CreatedIssue {
  number: number
  url: string
}

export async function createThisReposIssue(
  body: string
): Promise<CreatedIssue | null> {
  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    })
    // calculate todays date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]
    const title = `${core.getInput('issueTitle')} ${today}`
    const githubRepository = process.env.GITHUB_REPOSITORY
    if (!githubRepository) {
      throw new Error(`GITHUB_REPOSITORY environment variable is not set`)
    }
    const [owner, repo] = githubRepository.split(`/`)

    const response = await octokit.rest.issues.create({
      owner,
      repo,
      title,
      body
    })

    return {
      number: response.data.number,
      url: response.data.html_url
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
  return null
}

export async function closeOutOfBandIssues(
  outOfBandIssues: OutOfBandTopic[],
  checklistIssue: CreatedIssue
): Promise<void> {
  if (outOfBandIssues.length === 0) {
    return
  }

  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    })
    const githubRepository = process.env.GITHUB_REPOSITORY
    if (!githubRepository) {
      throw new Error(`GITHUB_REPOSITORY environment variable is not set`)
    }
    const [owner, repo] = githubRepository.split(`/`)

    for (const issue of outOfBandIssues) {
      // Add comment to the issue
      const comment = `This out-of-band topic has been added to the meeting checklist: ${checklistIssue.url}\n\nTopic: ${issue.title}\nExternal link: ${issue.url}`

      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: issue.issueNumber,
        body: comment
      })

      // Close the issue
      await octokit.rest.issues.update({
        owner,
        repo,
        issue_number: issue.issueNumber,
        state: 'closed'
      })

      console.log(`Closed out-of-band issue #${issue.issueNumber}`)
    }
  } catch (error) {
    // Log error but don't fail the workflow
    if (error instanceof Error) {
      console.error(`Error closing out-of-band issues: ${error.message}`)
    }
  }
}
