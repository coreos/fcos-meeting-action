# FCOS-Meeting

## Meeting Notes

The meeting is held every week, meetings are at `16:30 UTC` on Wednesdays. The meeting is held in https://matrix.to/#/#meeting-1:fedoraproject.org on matrix. The meeting is logged and the logs are available [here](https://meetbot.fedoraproject.org/teams/fedora_coreos_meeting/)

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
The meeting host needs to have a matrix account (an example is an account on the [fedora matrix server](https://chat.fedoraproject.org/#/room/#coreos:fedoraproject.org).)
The host needs to have access to the following channels on matrix
    - [#coreos:fedoraproject.org](https://matrix.to/#/#coreos:fedoraproject.org)
    - [#meeting-1:fedoraproject.org](https://matrix.to/#/#meeting-1:fedoraproject.org)
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

- All ad-hoc votes will be held via tracker issues in the fedora-coreos-tracker repository.
- Ad-hoc votes must be announced on the current primary mailing list for Fedora CoreOS.
- Ad-Hoc votes must be open for at least three hours after the announcement.

At least 5 people must vote, or 51% of the WG membership, whichever is less. Votes are "+1" (in favor), "-1" (against), or +0 (abstain). Votes pass by a 2/3 majority of those voting (round up).
</details>


## Meeting Steps

1. Join channel [#meeting-1:fedoraproject.org](https://matrix.to/#/#meeting-1:fedoraproject.org) on matrix, copy these commands and paste them in the channel

    - [ ] `!startmeeting fedora_coreos_meeting`
    - [ ] `!topic roll call`

2. Switch to channel [#coreos:fedoraproject.org](https://matrix.to/#/#coreos:fedoraproject.org) on matrix

    - [ ] Copy the following notification and post it

        ```text
        aaradhak anthr76 apiaseck davdunc dustymabe gursewak jaimelm jbrooks jcajka jdoss jlebon jmarrero lorbus miabbott nasirhm quentin9696[m] ravanelli saqali walters
        FCOS community meeting in #fedora-meeting-1
        If you don't want to be pinged remove your name from this file: https://github.com/coreos/fedora-coreos-tracker/blob/main/issue_template/meeting-template.md
        ```

3. Switch back to [#meeting-1:fedoraproject.org](https://matrix.to/#/#meeting-1:fedoraproject.org) wait for people to join

4. After 2-4 mins pass start the Action items from last meeting

    - [ ] `!topic Action items from last meeting`
    - [ ] `{{action-items}}`

5. After the Action items are covered start the topics from the tracker

    - [ ] Cover the below topics from the tracker repository
{{meeting-topics}}

6. Once all the topics are covered start the open floor

    - [ ] `!topic Open Floor`

7. Once the time limit is reached or the open floor is quiet end the meeting

    - [ ] `!endmeeting`

## Housekeeping

1. Navigate to the [tickets that were discussed](https://github.com/coreos/fedora-coreos-tracker/labels/meeting)

   - [ ] Remove `meeting` label
   - [ ] Add any relevant information to the ticket

2. Email a meeting summary

   - [ ] to: `coreos@lists.fedoraproject.org`
   - [ ] subject: Fedora CoreOS Community Meeting Minutes YYYY-MM-DD
   - [ ] cc: `devel@lists.fedoraproject.org`
   - [ ] The body of the email is two parts
        - [ ] Header

            1. Copy and paste the following

                ```text
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
        ```bash
        fcosmeetinghtml() {
            SUMMARY_URL="$1"

            # Extract meeting date and time from the summary URL
            MEETING_DATE_TIME=$(echo "$SUMMARY_URL" | grep -Eo '[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{2}\.[0-9]{2}')

            # Extract meeting date from the date and time
            MEETING_DATE=$(echo "$MEETING_DATE_TIME" | cut -d'-' -f1-3)

            # Hydrate the raw summary URL based on the meeting date and time
            RAW_SUMMARY_URL="https://meetbot-raw.fedoraproject.org/meeting-1_matrix_fedoraproject-org/$MEETING_DATE/fedora-coreos-meeting.$MEETING_DATE_TIME.html"

            # Generate the log URL based on the meeting date and time
            RAW_LOG_URL="https://meetbot-raw.fedoraproject.org/meeting-1_matrix_fedoraproject-org/$MEETING_DATE/fedora-coreos-meeting.$MEETING_DATE_TIME.log.html"

            # Extract line numbers and timestamps from the log file
            timestamps_and_lines=$(curl -s "$RAW_LOG_URL" | grep -Eo '<div class="d-table-row" id="l-[0-9]+">|<div class="d-table-cell time shrink pe-1">[0-9]{2}:[0-9]{2}:[0-9]{2}</div>')

            # Generate sed commands to replace timestamps with hyperlinks including line numbers
            sed_commands=""
            current_line=""
            while read -r line; do
                if [[ "$line" =~ '<div class="d-table-row" id="l-' ]]; then
                    current_line=$(echo "$line" | grep -Eo 'id="l-[0-9]+"')
                elif [[ "$line" =~ '<div class="d-table-cell time shrink pe-1">' ]]; then
                    timestamp=$(echo "$line" | grep -Eo '[0-9]{2}:[0-9]{2}:[0-9]{2}')
                    line_number=$(echo "$current_line" | grep -Eo '[0-9]+')
                    sed_commands+="s@.*<span class=\"details\">.*($timestamp).*<\/span>@<a href=\"$RAW_LOG_URL#l-$line_number\">&<\/a>@;"
                fi
            done <<< "$timestamps_and_lines"

            # Apply sed commands to the summary file, delete <head> contents, and echo the result
            curl -s "$RAW_SUMMARY_URL" | sed -E -e "$sed_commands" | sed '/<head>/,/<\/head>/d' | sed 's/TOPIC://g'
        }

        ```
    - [ ] In the terminal run `fcosmeetinghtml <this-meetings-notes>.html`
    - [ ] Copy and paste the output into the post body
