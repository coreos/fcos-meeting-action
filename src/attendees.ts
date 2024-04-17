import * as core from '@actions/core'
import axios from 'axios'

export async function GetAttendees(): Promise<string> {
  try {
    console.log(`GetAttendees started`)
    // Fetch the attendees from the specified URL
    const fetchedRollCall = await fetchData(core.getInput('peopleListURL'))
    const peopleList = fetchedRollCall.split('\n').slice(2).join(' ')
    console.log(peopleList)

    return peopleList
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
    return `Failed to get attendees. Check here https://github.com/coreos/fedora-coreos-tracker/blob/main/meeting-people.txt`
  }
}

async function fetchData(url: string): Promise<string> {
  const options = {
    method: `GET`,
    url
  }
  return (await axios(options)).data
}
