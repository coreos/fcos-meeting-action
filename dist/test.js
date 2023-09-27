"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const axios_1 = __importDefault(require("axios"));
async function run() {
    try {
        // Set constants 
        const actionItems = '<action-items>';
        const meetingTopics = '<meeting-topics>';
        const actionItemsRegEx = new RegExp("(?s)(?<=Action Items\n------------).*?(?=Action Items,)");
        const meetingListRegEx = new RegExp("(?s)(?<=>fedora_coreos_meeting.).*?(?=<\/a>)");
        const meetingNotesURL = "https://meetbot-raw.fedoraproject.org/teams/fedora_coreos_meeting/";
        var lastMeetingNotesUrl = "https://meetbot-raw.fedoraproject.org/teams/fedora_coreos_meeting/fedora_coreos_meeting.";
        var issueTemplate = fs.readFileSync('issue_template.md', 'utf8');
        var listOfMeetings = await fetchData(meetingNotesURL);
        var meetingMatches = meetingListRegEx.exec(listOfMeetings);
        if (meetingMatches != null) {
            var lastMeeting = meetingMatches[meetingMatches.length - 2];
            // This should be the latest meeting's date in with the format of YYYY-MM-DD-HH.MM.txt
            lastMeetingNotesUrl = lastMeetingNotesUrl + lastMeeting;
            var lastMeetingNotes = await fetchData(lastMeetingNotesUrl);
            var actionItemMatches = actionItemsRegEx.exec(lastMeetingNotes);
            if (actionItemMatches != null) {
                return issueTemplate.replace(actionItems, actionItemMatches[0]);
            }
            else {
                return issueTemplate.replace(actionItems, "#info There were no action items from the last meeting");
            }
        }
        else {
            throw new Error("No meetings found");
        }
        // Calculate next Wednesday
        var current = new Date();
        var daysTillNextWendsday = (10 - current.getDate()) % 7;
        var nextWendsdayDate = new Date();
        nextWendsdayDate.setDate(current.getDate() + daysTillNextWendsday);
        // Expected issue name
        var issueName = "FCOS Meeting - " + nextWendsdayDate.toISOString().split('T')[0];
        // open template file
        //
    }
    catch (error) {
        // Fail the workflow run if an error occurs
        if (error instanceof Error)
            core.setFailed(error.message);
    }
}
exports.run = run;
async function fetchData(url) {
    var options = {
        method: 'GET',
        url: url
    };
    return (0, axios_1.default)(options)
        .then(function (response) {
        return response.data;
    })
        .catch(function (error) {
        return error.response.data;
    });
}
//# sourceMappingURL=test.js.map