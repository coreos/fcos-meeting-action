# FCOS-Meeting

## Meeting Notes
The meeting is held every week, meetings are at `16:30 UTC` on Wednesdays. The meeting is held in #fedora-meeting-1 on libera.chat. The meeting is logged and the logs are available at https://meetbot.fedoraproject.org/teams/fedora_coreos_meeting/

### Required Concepts

<details>
<summary>Voting</summary>
On some topics we will need to vote. The following rules apply to the voting
process.

<details>
<summary>Working Group Members and Points of Contact</summary>
Please see [meeting-people.txt](https://github.com/coreos/fedora-coreos-tracker/blob/main/meeting-people.txt).
</details>

<details>
<summary>Meeting host Requirements</summary>
The meeting host needs to have IRC configured and setup on their machine.
The host needs to have access to the following channels on libera.chat
    - `#fedora-meeting-1`
    - `#fedora-coreos`
The host needs to have a fedora account and be able to post discussion topics to the [fedora project](https://discussion.fedoraproject.org/tag/coreos-wg)
</details>
## For Regularly Scheduled Meetings

A quorum for the meeting is 5 people, or 51% of the members of the WG listed
below, which ever is lower. Voting items must pass with a majority of the
members voting at the meeting.

## For General Ad-Hoc Votes

- All ad-hoc votes will be held via [tracker issues](https://github.com/coreos/fedora-coreos-tracker/).
- Ad-hoc votes must be announced on the current primary mailing list for Fedora Atomic (atomic-devel).
- Ad-hoc votes must be open for at least three working days (see below) after the announcement.

At least 5 people must vote, or 51% of the WG membership, whichever is
less. Votes are "+1" (in favor), "-1" (against), or +0 (abstain). Votes
pass by a simple majority of those voting.

## For Urgent Ad-Hoc Votes

- All ad-hoc votes will be held via tracker issues in the fedora-coreos-tracker repo.
- Ad-hoc votes must be announced on the current primary mailing list for Fedora CoreOS.
- Ad-Hoc votes must be open for at least three hours after the announcement.

At least 5 people must vote, or 51% of the WG membership, whichever is less. Votes are "+1" (in favor), "-1" (against), or +0 (abstain). Votes pass by a 2/3 majority of those voting (round up).
</details>


## Meeting Steps
1. Join channel #fedora-meeting-1 on libera.chat copy these commands and paste them in the channel
    
    - [ ] `#startmeeting fedora_coreos_meeting`
    - [ ] `#topic roll call`

2. Switch to channel #fedora-coreos on libera.chat
    
    - [ ] Copy the following notification and post it
        ``` 
        aaradhak anthr76 apiaseck davdunc dustymabe gursewak jaimelm jbrooks jcajka jdoss jlebon jmarrero lorbus miabbott nasirhm quentin9696[m] ravanelli saqali walters 
        FCOS community meeting in #fedora-meeting-1
        If you don't want to be pinged remove your name from this file: https://github.com/coreos/fedora-coreos-tracker/blob/main/issue_template/meeting-template.md
        ```

3. Switch back to #fedora-meeting-1 wait for people to join and add each of them as a chair

    - [ ] `#chair <name>`

4. After 2-4 mins pass start the Action items from last meeting

    - [ ] `#topic Action items from last meeting`
    - [ ] `{{action-items}}`

5. After the Action items are covered start the topics from the tracker
    
    - [ ] Cover the below topics from the tracker repo
{{meeting-topics}}

6. Once all the topics are covered start the open floor

    - [ ] `#topic Open Floor`

7. Once the time limit is reached or the open floor is quiet end the meeting

    - [ ] `#endmeeting`

## Housekeeping

1. Navigate to the [tickets that were discussed](https://github.com/coreos/fedora-coreos-tracker/labels/meeting)

   - [ ] Remove `meeting` label
   - [ ] Add any relevant information to the ticket

2. Email a meeting summary
   
   - [ ] to: coreos@lists.fedoraproject.org
   - [ ] subject: Fedora CoreOS Community Meeting Minutes YYYY-MM-DD
   - [ ] cc: devel@lists.fedoraproject.org
   - [ ] The body of the email is two parts
        - [ ] Header

            1. Copy and paste the following

                ```
                Minutes: <this-meetings-notes>.html
                Minutes (text): <this-meetings-notes>.txt
                Log: <this-meetings-notes>.log.html
                ```
            2. Update the `<this-meetings-notes>` with the link from `https://meetbot-raw.fedoraproject.org//fedora-meeting-1/YYYY-MM-DD/`

        - [ ] Body

            1. Copy and paste the contents of the `<this-meetings-notes>.txt` file
            
3. Post to [fedora project](https://discussion.fedoraproject.org/tag/coreos-wg)
    - [ ] subject: `Fedora CoreOS Community Meeting Minutes YYYY-MM-DD`
    - [ ] category: `Project Discussion`
    - [ ] tags: `coreos-wg`
    - [ ] In the terminal Copy and paste the following
        ```
        fcosmeetinghtml() {
            local url=$1
            # we'll substitute in using the non-raw url for nice highlighting of line numbers
            local baseurl=$(dirname $url)
            if [[ ! $url =~ raw ]]; then
                url=$(echo "$url" | sed "s|meetbot.fedoraproject.org|meetbot-raw.fedoraproject.org|")
            fi
            # Take the html and delete the <head> contents (doesn't render correctly)
            # and also substitute in the base url to make relative URLs absolute.
            curl --silent $url                                | \
                sed -z 's|<head>.*</head>||'                  | \
                sed "s|href='fedora|href='${baseurl}/fedora|" | \
                sed "s|href=\"fedora|href=\"${baseurl}/fedora|"
        }
        ```

    - [ ] In the terminal run `fcosmeetinghtml <this-meetings-notes>.html`
    - [ ] Copy and paste the output into the post body