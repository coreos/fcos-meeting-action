import * as core from '@actions/core'
import { GetActionItems } from './actionItems'
import { GetMeetingTopics } from './meetingTopics'
import { createThisReposIssue } from './createIssue'
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
    const meetingTopics = await GetMeetingTopics()
    console.log(meetingTopics)

    const issueBody = hydrateIssueTemplate(
      attendees,
      actionItems,
      meetingTopics
    )
    console.log('Create issue')
    createThisReposIssue(issueBody)
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
