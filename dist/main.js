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
const actionItems_1 = require("./actionItems");
const meetingTopics_1 = require("./meetingTopics");
const createIssue_1 = require("./createIssue");
const fs_1 = __importDefault(require("fs"));
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
    try {
        console.log('GetActionItems');
        const actionItems = await (0, actionItems_1.GetActionItems)();
        console.log(actionItems);
        console.log('Get meeting topics');
        const meetingTopics = await (0, meetingTopics_1.GetMeetingTopics)();
        console.log(meetingTopics);
        const issueBody = hydrateIssueTemplate(actionItems, meetingTopics);
        console.log('Create issue');
        (0, createIssue_1.createThisReposIssue)('Fedora CoreOS Weekly Meeting', issueBody);
    }
    catch (error) {
        // Fail the workflow run if an error occurs
        if (error instanceof Error)
            core.setFailed(error.message);
    }
}
exports.run = run;
// read in templated issue body, and replace the placeholders with the actual content
function hydrateIssueTemplate(actionItems, meetingTopics) {
    // read in template file
    const issueTemplate = fs_1.default.readFileSync('./static/meeting-template.md', 'utf8');
    return issueTemplate
        .replace('{{action-items}}', actionItems)
        .replace('{{meeting-topics}}', meetingTopics);
}
//# sourceMappingURL=main.js.map