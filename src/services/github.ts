import { Octokit } from '@octokit/rest'

const octokit = new Octokit()

export interface PullRequest {
    number: number
    title: string
    html_url: string
    user: {
        login: string
    }
    requested_reviewers: Array<{
        login: string
    }>
}

export interface GitHubUser {
    login: string
    name: string | null
}

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
                name: data.name
            }
        } catch {
            return null
        }
    }
} 