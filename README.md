# FCOS-Meeting-Action

Welcome to the Fedora CoreOS Meeting tracker. This repository serves as a tracker for creating issues to track upcoming FCOS meetings. The issues are generated every Wednesday, and are meant to be used by the community meeting host as a guide for running the meeting.

The meeting notes are formed from three major parts. The first part is the [meeting template](./static/meeting-template.md), which is the base of the meeting notes. The second, and third parts are formed from the topics in the [fedora-coreos-tracker](https://github.com/coreos/fedora-coreos-tracker) repository and the past action items from the prior community meeting [fedora-meetings](https://meetbot-raw.fedoraproject.org/teams/fedora_coreos_meeting/fedora_coreos_meeting).

The Fedora CoreOS Working Group works to bring together the various technologies and produce Fedora CoreOS.
Get Fedora CoreOS

The Fedora CoreOS Working Group has a weekly meeting. The meeting usually happens in #fedora-meeting-1 on irc.libera.chat (Webchat) and the schedule for the meeting can be found in this [calendar](https://calendar.fedoraproject.org/CoreOS/) Currently, meetings are at 16:30 UTC on Wednesdays.

As the Matrix/IRC bridge is down, it is currently not possible to attend the meeting from a Matrix account and you have to join using IRC. You can use the Webchat to temporarily join the meeting on IRC.
Steps to run the meeting

    Navigate to this week's meeting and follow the steps presented.

Working days: non-holiday weekdays. Relevant holidays are the national holidays of the USA, Western Europe, and India.

# Tips

## Submitting Out-of-Band Topics

Out-of-band topics allow you to include discussion items from external sources (like RHCOS, other projects, or any URL) in the FCOS meeting without creating issues in the fedora-coreos-tracker repository.

### How to Submit an Out-of-Band Topic:

1. **Create a new issue** in this repository (`fcos-meeting-action`)
2. **Add the label**: `out-of-band-topic`
3. **Title your issue** with a descriptive meeting topic name
4. **Add a URL** in the issue body pointing to the external resource you want to discuss

**Example Issue:**
```
Title: Discuss new awesome feature
Label: out-of-band-topic
Body:
https://github.com/coreos/placeholder/issues/456
```

### What Happens Next:

- The action automatically includes your topic in the next meeting checklist
- If the URL points to a GitHub issue, the action fetches the real issue title
- If title fetching fails, your issue title is used instead
- The trigger issue is automatically closed with a comment linking to the meeting checklist
- Your external topic appears alongside regular tracker topics in the meeting agenda

### Supported URLs:

- GitHub issues (title auto-fetched)
- Any other URL (uses your issue title)

This feature is for discussing RHCOS topics, external dependencies, or one-time discussion items that might not make sense in the fedora-coreos-tracker repository

# Development

## Prerequisites

- install node package manger (npm)
- use npm to install TypeScript `npm install Typescript --save-dev`

## Dev Workflow 

- Work against the `.ts` files to add your changes
- Compile them using `npm run bundle` which produces `.js` files
- Commit the `.ts` and `.js` files

## Hosts

The running list is [here](https://hackmd.io/@4rqq1dsYSVuBswOHTKSIBA/ByDq2EK5p). If you would like to host, add your self to the rotation with a new date! 

### Note

The action uses the `.js` files to run the action, and are found in the `dist` directory. The `.ts` files are used for development purposes only.
