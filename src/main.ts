import * as core from '@actions/core'
import { GetActionItems } from './actionItems'
import { GetMeetingTopics } from './meetingTopics'
import { createThisReposIssue, closeOutOfBandIssues } from './createIssue'
import { GetAttendees } from './attendees'
import fs from 'fs'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    console.log('GetAttendees')
    const attendees = await GetAttendees()

    console.log('GetActionItems')
    const actionItems = await GetActionItems()
    console.log(actionItems)

    console.log('Get meeting topics')
    const meetingTopicsResult = await GetMeetingTopics()
    console.log(meetingTopicsResult.topics)

    const issueBody = hydrateIssueTemplate(
      attendees,
      actionItems,
      meetingTopicsResult.topics
    )
    console.log('Create issue')
    const createdIssue = await createThisReposIssue(issueBody)

    // Close out-of-band issues if any were processed
    if (createdIssue && meetingTopicsResult.outOfBandIssues.length > 0) {
      console.log('Closing out-of-band issues')
      await closeOutOfBandIssues(
        meetingTopicsResult.outOfBandIssues,
        createdIssue
      )
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

// read in templated issue body, and replace the placeholders with the actual content
function hydrateIssueTemplate(
  attendees: string,
  actionItems: string,
  meetingTopics: string
): string {
  // read in template file
  const issueTemplate = fs.readFileSync('./static/meeting-template.md', 'utf8')
  return issueTemplate
    .replace('{{attendees}}', attendees)
    .replace('{{action-items}}', actionItems)
    .replace('{{meeting-topics}}', meetingTopics)
}
