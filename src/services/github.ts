import { Octokit } from '@octokit/rest'
import { type PullRequest, type GitHubUser } from '../types'

const octokit = new Octokit()

export const github = {
    async getPullRequests(): Promise<PullRequest[]> {
        const { data } = await octokit.pulls.list({
            owner: 'vehikl',
            repo: 'reviewer',
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
    }
} 