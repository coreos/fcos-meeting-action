import * as core from '@actions/core'
import axios from 'axios';
export async function GetActionItems(): Promise<string> {
  try {
    // Set constants 
    const actionItemsRegEx = new RegExp("(?s)(?<=Action Items\n------------).*?(?=Action Items,)")
    const meetingListRegEx = new RegExp("(?s)(?<=>fedora_coreos_meeting.).*?(?=<\/a>)")
    const meetingNotesURL = "https://meetbot-raw.fedoraproject.org/teams/fedora_coreos_meeting/"
    
    var lastMeetingNotesUrl = "https://meetbot-raw.fedoraproject.org/teams/fedora_coreos_meeting/fedora_coreos_meeting."
    var listOfMeetings = await fetchData(meetingNotesURL)
    var meetingMatches = meetingListRegEx.exec(listOfMeetings)
    
    if (meetingMatches != null) {
      var lastMeeting = meetingMatches[meetingMatches.length-2]
      // This should be the latest meeting's date in with the format of YYYY-MM-DD-HH.MM.txt
      lastMeetingNotesUrl = lastMeetingNotesUrl + lastMeeting
      var lastMeetingNotes = await fetchData(lastMeetingNotesUrl)
      var actionItemMatches = actionItemsRegEx.exec(lastMeetingNotes)
      if (actionItemMatches != null) {
        return actionItemMatches[0]
      } else {
        return "There were no action items from the last meeting"
      }
    }
    
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }

  return "There was an error getting the action items"
}

async function fetchData(url: string): Promise<string>{
  var options = {
    method: 'GET',
    url: url
  }
  return axios(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error.response.data;
    })
}