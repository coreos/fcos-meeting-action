import * as core from '@actions/core'
import { match } from 'assert'
import axios from 'axios'
import { stringify } from 'querystring'

export const actionItemsRegEx = new RegExp(
  `Action items\n[-]+\n([\s\S]*?)\nPeople Present`,
  'm'
)
export const meetingListRegEx = new RegExp(
  `(?<=>fedora-coreos-meeting.)(.*?)=?txt`,
  `g`
)
export const folderRegex = new RegExp(
  `/<img src="\/icons\/folder.gif" alt="\[DIR\]"> <a href="([^"]+)\/">/`,
  `g`
)
const meetingNotesRootURL = core.getInput('rootURLMeetingLogs')

export async function GetActionItems(): Promise<string> {
  try {
    console.log('GetActionItems started')
    const listOfAllDateFolders = await getAllDateFolders()
    console.log('List of all available dates ', listOfAllDateFolders)
    for (let i = 0; i < listOfAllDateFolders.length; i++) {
      const folder = listOfAllDateFolders[i]
      console.log('Checking folder: ', folder)
      let meetingMatches = await getFCOSMeetingMatches(folder)
      if (meetingMatches != null) {
        console.log('Found FCOS meeting in folder: ', folder)
        // We want the last match, which is just the txt file
        const lastMatch = meetingMatches[meetingMatches.length - 1]
        console.log('Meeting notes expected URL: ', `${folder}${lastMatch}`)
        let meetingTxt = fetchData(`${folder}${lastMatch}`)
        let actionItems = (await meetingTxt).match(actionItemsRegEx)
        if (actionItems != null) {
          console.log('Found action items in meeting notes: ', actionItems[1])
          // return the the captured group
          if (actionItems[1] == '') {
            return '!topic there are no action items from the last meeting.'
          }
          return actionItems[1]
        }
      }
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }

  return `Failed: to get action items, check the last meeting notes for action items. ${meetingNotesRootURL}`
}

async function fetchData(url: string): Promise<string> {
  const options = {
    method: 'GET',
    url
  }
  return (await axios(options)).data
}

async function getAllDateFolders(): Promise<string[]> {
  const urls: string[] = []
  const rawHtml = fetchData(meetingNotesRootURL)
  let match = (await rawHtml).match(folderRegex)
  if (match == null) {
    throw new Error(
      'No meetings found in the meeting notes root URL. Check rootURL, or the regex for matching links.'
    )
  }

  for (let i = 0; i < match.length; i++) {
    const folderUrl = match[i]
    const fullUrl = `${meetingNotesRootURL}${folderUrl}/`
    urls.unshift(fullUrl)
  }

  return urls
}

async function getFCOSMeetingMatches(
  html: string
): Promise<RegExpMatchArray | null> {
  const rawHtml = await fetchData(html)
  const matches = rawHtml.match(meetingListRegEx)

  if (matches != null) {
    console.log('Found FCOS meeting matches: ', matches)
    return matches
  }
  return null
}
