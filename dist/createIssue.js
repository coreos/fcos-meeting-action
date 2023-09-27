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
exports.createThisReposIssue = void 0;
const core = __importStar(require("@actions/core"));
const octo = __importStar(require("@octokit/rest"));
async function createThisReposIssue(title, body) {
    try {
        const octokit = new octo.Octokit({
            auth: process.env.GITHUB_TOKEN
        });
        const githubRepository = process.env.GITHUB_REPOSITORY;
        if (!githubRepository) {
            throw new Error('GITHUB_REPOSITORY environment variable is not set');
        }
        const [owner, repo] = githubRepository.split('/');
        await octokit.request('POST /repos/{owner}/{repo}/issues', {
            owner,
            repo,
            title,
            body
        });
    }
    catch (error) {
        // Fail the workflow run if an error occurs
        if (error instanceof Error)
            core.setFailed(error.message);
    }
}
exports.createThisReposIssue = createThisReposIssue;
//# sourceMappingURL=createIssue.js.map