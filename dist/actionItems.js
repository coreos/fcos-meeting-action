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
exports.GetActionItems = void 0;
const core = __importStar(require("@actions/core"));
const axios_1 = __importDefault(require("axios"));
async function GetActionItems() {
    try {
        // Set constants
        //(?s)(?<=Action Items\\n------------).*?(?=Action Items,)
        const actionItemsRegEx = new RegExp('(?<=Action Items\n------------\n)((.|\n)*)(?=Action Items,)');
        // (?s)(?<=>fedora_coreos_meeting.).*?(?=</a>)
        const meetingListRegEx = new RegExp('(?<=>fedora_coreos_meeting.).*?(?=</a>)');
        const meetingNotesURL = 'https://meetbot-raw.fedoraproject.org/teams/fedora_coreos_meeting/';
        let lastMeetingNotesUrl = 'https://meetbot-raw.fedoraproject.org/teams/fedora_coreos_meeting/fedora_coreos_meeting.';
        const listOfMeetings = await fetchData(meetingNotesURL);
        const meetingMatches = meetingListRegEx.exec(listOfMeetings);
        if (meetingMatches != null) {
            const lastMeeting = meetingMatches[meetingMatches.length - 2];
            // This should be the latest meeting's date in with the format of YYYY-MM-DD-HH.MM.txt
            lastMeetingNotesUrl = lastMeetingNotesUrl + lastMeeting;
            const lastMeetingNotes = await fetchData(lastMeetingNotesUrl);
            const actionItemMatches = actionItemsRegEx.exec(lastMeetingNotes);
            if (actionItemMatches != null) {
                return actionItemMatches[0];
            }
            else {
                return 'There were no action items from the last meeting';
            }
        }
    }
    catch (error) {
        // Fail the workflow run if an error occurs
        if (error instanceof Error)
            core.setFailed(error.message);
    }
    return 'There was an error getting the action items';
}
exports.GetActionItems = GetActionItems;
async function fetchData(url) {
    const options = {
        method: 'GET',
        url
    };
    return await (await (0, axios_1.default)(options)).data;
}
//# sourceMappingURL=actionItems.js.map