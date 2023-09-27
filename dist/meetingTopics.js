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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMeetingTopics = void 0;
const core = __importStar(require("@actions/core"));
const rest_1 = require("@octokit/rest");
async function GetMeetingTopics() {
    try {
        const octokit = new rest_1.Octokit({
            auth: process.env.GITHUB_TOKEN
        });
        const issues = await octokit.issues.listForRepo({
            owner: `coreos`,
            repo: `fedora-coreos-tracker`,
            labels: `meeting`,
            state: `open`
        });
        if (issues.data.length === 0) {
            return `#topic No meeting topics found.`;
        }
        let issuesToBeDiscussed = ``;
        for (let i = 0; i < issues.data.length; i++) {
            issuesToBeDiscussed += `    - [ ] \`#topic ${issues.data[i].title}\`  \n`;
            issuesToBeDiscussed += `        - \`#link ${issues.data[i].html_url}\`  \n`;
        }
        return issuesToBeDiscussed;
    }
    catch (error) {
        // Fail the workflow run if an error occurs
        if (error instanceof Error)
            core.setFailed(error.message);
    }
    return `Failed: to get meeting topics, requires manual intervention.`;
}
exports.GetMeetingTopics = GetMeetingTopics;
//# sourceMappingURL=meetingTopics.js.map