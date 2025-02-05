import { Octokit } from '@octokit/rest'
import { type PullRequest, type GitHubUser } from '../types'

// Get token from environment variable
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN
const GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER || 'vehikl'
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || 'reviewer'

if (!GITHUB_TOKEN) {
    console.error('VITE_GITHUB_TOKEN environment variable is not set')
}

const octokit = new Octokit({
    auth: GITHUB_TOKEN
})

export const github = {
    async getPullRequests(): Promise<PullRequest[]> {
        const { data } = await octokit.pulls.list({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            state: 'open'
        })
        
        // Filter for PRs with no reviewers
        return data.filter(pr => 
            !pr.requested_reviewers || pr.requested_reviewers.length === 0
        ) as PullRequest[]
    },

    async getUser(username: string): Promise<GitHubUser | null> {
        try {
            const { data } = await octokit.users.getByUsername({ username })
            return {
                login: data.login,
                name: data.name,
                avatar_url: data.avatar_url
            }
        } catch {
            return null
        }
    },

    async assignReviewer(prNumber: number, reviewerUsername: string): Promise<void> {
        await octokit.pulls.requestReviewers({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            pull_number: prNumber,
            reviewers: [reviewerUsername]
        })
    }
} 