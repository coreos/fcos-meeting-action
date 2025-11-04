import * as core from '@actions/core'
import { Octokit } from '@octokit/rest'

export interface OutOfBandTopic {
  issueNumber: number
  title: string
  url: string
}

export interface MeetingTopicsResult {
  topics: string
  outOfBandIssues: OutOfBandTopic[]
}

export async function GetMeetingTopics(): Promise<MeetingTopicsResult> {
  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    })

    // Get topics from the tracking repo
    const [owner, repo] = core.getInput('trackingRepo').split(`/`)
    const trackerIssues = await octokit.issues.listForRepo({
      owner,
      repo,
      labels: `meeting`,
      state: `open`
    })

    // Get out-of-band topics from this repo
    const githubRepository = process.env.GITHUB_REPOSITORY
    if (!githubRepository) {
      throw new Error(`GITHUB_REPOSITORY environment variable is not set`)
    }
    const [thisOwner, thisRepo] = githubRepository.split(`/`)
    const outOfBandIssues = await octokit.issues.listForRepo({
      owner: thisOwner,
      repo: thisRepo,
      labels: `out-of-band-topic`,
      state: `open`
    })

    // Process out-of-band topics
    const processedOutOfBand: OutOfBandTopic[] = []
    const outOfBandTopics: { title: string; url: string }[] = []

    for (const issue of outOfBandIssues.data) {
      const externalUrl = extractFirstUrl(issue.body || '')
      if (!externalUrl) {
        console.warn(
          `Out-of-band issue #${issue.number} has no URL in body, skipping`
        )
        continue
      }

      // Try to fetch external title, fallback to trigger issue title
      let topicTitle = issue.title
      const externalTitle = await fetchExternalTitle(octokit, externalUrl)
      if (externalTitle) {
        topicTitle = externalTitle
      }

      outOfBandTopics.push({ title: topicTitle, url: externalUrl })
      processedOutOfBand.push({
        issueNumber: issue.number,
        title: topicTitle,
        url: externalUrl
      })
    }

    // Combine all topics
    const allTopics = [
      ...trackerIssues.data.map((i: { title: string; html_url: string }) => ({
        title: i.title,
        url: i.html_url
      })),
      ...outOfBandTopics
    ]

    if (allTopics.length === 0) {
      return {
        topics: `!topic No meeting topics found.`,
        outOfBandIssues: []
      }
    }

    let issuesToBeDiscussed = ``
    for (const topic of allTopics) {
      issuesToBeDiscussed += `    - [ ] \`!topic ${topic.title}\`  \n`
      issuesToBeDiscussed += `        - \`!link ${topic.url}\`  \n`
    }

    return {
      topics: issuesToBeDiscussed,
      outOfBandIssues: processedOutOfBand
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
  return {
    topics: `Failed: to get meeting topics, requires manual intervention.`,
    outOfBandIssues: []
  }
}

function extractFirstUrl(text: string): string | null {
  const urlRegex = /(https?:\/\/[^\s]+)/
  const match = text.match(urlRegex)
  return match ? match[1] : null
}

async function fetchExternalTitle(
  octokit: Octokit,
  url: string
): Promise<string | null> {
  try {
    // Try to parse as GitHub issue URL
    const githubIssueRegex =
      /https?:\/\/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/
    const match = url.match(githubIssueRegex)

    if (match) {
      const [, owner, repo, issueNumber] = match
      const issue = await octokit.issues.get({
        owner,
        repo,
        issue_number: parseInt(issueNumber, 10)
      })
      return issue.data.title
    }
  } catch (error) {
    console.warn(`Failed to fetch external title from ${url}:`, error)
  }
  return null
}
