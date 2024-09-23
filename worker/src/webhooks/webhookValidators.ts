import { webhookValidatorFunction } from "./webhookValidatorFunction";
import { githubPullRequestValidator } from "./github/pullRequests";

type WebhookValidatorMap = {
    [key: string]: webhookValidatorFunction
}

export const webhookValidators: WebhookValidatorMap = {
    githubPullRequest: githubPullRequestValidator
}
