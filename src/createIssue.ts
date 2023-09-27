import * as core from '@actions/core'
import { Octokit } from 'octokit'

export async function createThisReposIssue(
  title: string,
  body: string
): Promise<void> {
  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    })
    const githubRepository = process.env.GITHUB_REPOSITORY
    if (!githubRepository) {
      throw new Error(`GITHUB_REPOSITORY environment variable is not set`)
    }
    const [owner, repo] = githubRepository.split(`/`)
    
    await octokit.rest.issues.create({
      owner,
      repo,
      title,
      body
    })
  } catch (error) {
    console.log(error)
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
