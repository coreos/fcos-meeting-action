import * as core from '@actions/core'
import axios from 'axios'
export async function GetActionItems(): Promise<string> {
  try {
    // Set constants
    //(?s)(?<=Action Items\\n------------).*?(?=Action Items,)
    const actionItemsRegEx = new RegExp(
      '(?<=Action Items\n------------\n)((.|\n)*)(?=Action Items,)'
    )
    // (?s)(?<=>fedora_coreos_meeting.).*?(?=</a>)
    const meetingListRegEx = new RegExp(
      '(?<=>fedora_coreos_meeting.).*?(?=</a>)'
    )
    const meetingNotesURL =
      'https://meetbot-raw.fedoraproject.org/teams/fedora_coreos_meeting/'

    let lastMeetingNotesUrl =
      'https://meetbot-raw.fedoraproject.org/teams/fedora_coreos_meeting/fedora_coreos_meeting.'
    const listOfMeetings = await fetchData(meetingNotesURL)
    const meetingMatches = meetingListRegEx.exec(listOfMeetings)

    if (meetingMatches != null) {
      const lastMeeting = meetingMatches[meetingMatches.length - 2]
      // This should be the latest meeting's date in with the format of YYYY-MM-DD-HH.MM.txt
      lastMeetingNotesUrl = lastMeetingNotesUrl + lastMeeting
      const lastMeetingNotes = await fetchData(lastMeetingNotesUrl)
      const actionItemMatches = actionItemsRegEx.exec(lastMeetingNotes)
      if (actionItemMatches != null) {
        return actionItemMatches[0]
      } else {
        return 'There were no action items from the last meeting'
      }
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }

  return 'There was an error getting the action items'
}

async function fetchData(url: string): Promise<string> {
  const options = {
    method: 'GET',
    url
  }
  return await (
    await axios(options)
  ).data
}
