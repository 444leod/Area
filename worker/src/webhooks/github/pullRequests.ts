import { webhookValidatorFunction } from "../webhookValidatorFunction";
import { webhookFunction } from "../webhookFunction";

export const githubPullRequestValidator: webhookValidatorFunction = (webhook) => {
    if (!webhook.body) {
        console.error("Webhook body is missing");
        return false;
    }

    if (!webhook.headers) {
        console.error("Webhook headers are missing");
        return false;
    }

    if (!webhook.headers["x-github-event"]) {
        console.error("Webhook event is missing");
        return false;
    }

    if (webhook.headers["x-github-event"] !== "pull_request") {
        console.error("Webhook event is not a pull request");
        return false;
    }
    return webhook.body && webhook.headers && webhook.headers["x-github-event"] === "pull_request" && webhook.body?.action === "opened";
}

export const githubPullRequestFunction: webhookFunction = (webhook) => {
    const body = webhook.body;
    return {
        branchName: body.pull_request?.head?.ref || "",
        sender: body.sender,
        organization: body.organization,
        changes: body.changes,
        repository: body.repository
    }
}
