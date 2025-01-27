import { Octokit } from '@octokit/rest'

const octokit = new Octokit()

export interface PullRequest {
    number: number
    title: string
    html_url: string
    user: {
        login: string
    }
}

export const github = {
    async getPullRequests(): Promise<PullRequest[]> {
        const { data } = await octokit.pulls.list({
            owner: 'vehikl',
            repo: 'reviewer',
            state: 'open'
        })
        return data
    }
} 