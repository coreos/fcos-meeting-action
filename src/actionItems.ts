import * as core from '@actions/core'
import axios from 'axios'
export async function GetActionItems(): Promise<string> {
  try {
    console.log(`GetActionItems started`)
    // Set constants
    const actionItemsRegEx = new RegExp(
      `(?<=Action Items\n------------\n)((.|\n)*)(?=Action Items,)`
    )
    const meetingListRegEx = new RegExp(
      `(?<=>fedora_coreos_meeting.)(.*?)=?txt`,`g`
    )
    const meetingNotesURL =
      `https://meetbot-raw.fedoraproject.org/teams/fedora_coreos_meeting/`

    let lastMeetingNotesUrl =
      `https://meetbot-raw.fedoraproject.org/teams/fedora_coreos_meeting/fedora_coreos_meeting.`
    const listOfMeetings = await fetchData(meetingNotesURL)
    let matches = listOfMeetings.match(meetingListRegEx)
  
    if (matches != null) {
      const lastMeeting = matches[matches.length - 1]
      // This should be the latest meeting`s date in with the format of YYYY-MM-DD-HH.MM.txt
      lastMeetingNotesUrl = lastMeetingNotesUrl + lastMeeting
      console.debug("last meeting notes url" + lastMeetingNotesUrl)
      const lastMeetingNotes = await fetchData(lastMeetingNotesUrl)
      const actionItemMatches = actionItemsRegEx.exec(lastMeetingNotes)
    
      if (actionItemMatches) {
        console.debug("action item matches" + actionItemMatches[0])
    
        // if the match is just new lines, then there were no action items
        if (actionItemMatches[0].match(/^\s*$/)) {
          return `#topic there are no action items from the last meeting.`
        }
        return actionItemMatches[0]
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
