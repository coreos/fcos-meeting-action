import * as core from '@actions/core'
import * as octo from '@octokit/rest'

export async function createThisReposIssue(title: string, body: string): Promise<void> {
    try {
        const octokit = new octo.Octokit({
            auth: process.env.GITHUB_TOKEN
        })
        const githubRepository = process.env.GITHUB_REPOSITORY
        if (!githubRepository) {
            throw new Error('GITHUB_REPOSITORY environment variable is not set')
        }
        const [owner, repo] = githubRepository.split('/')
        
        await octokit.request('POST /repos/{owner}/{repo}/issues', {
            owner,
            repo,
            title,
            body
        })
    } catch (error) {
        // Fail the workflow run if an error occurs
        if (error instanceof Error) core.setFailed(error.message)
    }
}