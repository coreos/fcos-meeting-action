import * as core from '@actions/core'
import axios from 'axios'
export async function GetActionItems(): Promise<string> {
  try {
    console.log(`GetActionItems started`)
    const actionItemsRegEx = new RegExp(
      `(?<=Action items\n------------\n)((?:.*\n)*?)(?=\n[A-Z])`,
      's'
    )
    const meetingListRegEx = new RegExp(
      `fedora-coreos-meeting\\.(\\d{4}-\\d{2}-\\d{2}-\\d{2}\\.\\d{2})\\.txt`,
      `g`
    )
    const allMeetingNotes = core.getInput('rootURLMeetingLogs')
    const sevenDaysAgo: string = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]
    const meetingNotesURL = allMeetingNotes + sevenDaysAgo + `/`
    const listOfMeetings = await fetchData(meetingNotesURL)
    const matches = listOfMeetings.match(meetingListRegEx)

    if (matches != null) {
      const lastMeeting = matches[matches.length - 1]
      const dateTimeMatch = lastMeeting.match(
        /(\d{4}-\d{2}-\d{2}-\d{2}\.\d{2})/
      )
      if (!dateTimeMatch) {
        throw new Error(`Could not parse meeting date from: ${lastMeeting}`)
      }
      const dateTime = dateTimeMatch[1]
      // Construct URL to the .txt file with format: fedora-coreos-meeting.YYYY-MM-DD-HH.MM.txt
      const lastMeetingNotesUrl =
        meetingNotesURL + 'fedora-coreos-meeting.' + dateTime + '.txt'
      console.debug(`last meeting notes url ${lastMeetingNotesUrl}`)
      const lastMeetingNotes = await fetchData(lastMeetingNotesUrl)
      const actionItemMatches = actionItemsRegEx.exec(lastMeetingNotes)

      if (actionItemMatches) {
        const actionItems = actionItemMatches[0].trim()
        console.debug(`action item matches: ${actionItems}`)
        // if the match is just whitespace, then there were no action items
        if (!actionItems || actionItems.match(/^\s*$/)) {
          return `!topic there are no action items from the last meeting.`
        }
        return actionItems
      }
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }

  return `Failed: to get action items, check the last meeting notes.`
}

async function fetchData(url: string): Promise<string> {
  const options = {
    method: `GET`,
    url
  }
  return await (
    await axios(options)
  ).data
}
