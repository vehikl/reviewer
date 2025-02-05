export interface Person {
    id: number
    name: string | null
    username: string
    avatar_url: string
}

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
    avatar_url: string
} 