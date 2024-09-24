import { webhookFunction } from "./webhookFunction";
import { githubPullRequestFunction } from "./github/pullRequests";

type WebhookFunctionMap = {
    [key: string]: webhookFunction
}

export const webhookFunctions: WebhookFunctionMap = {
    githubPullRequest: githubPullRequestFunction
}
