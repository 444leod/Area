import { reactionsMap } from '../reactions/reactionsMap';
import { webhookValidators } from './webhookValidators';
import { webhookFunctions } from './webhookFunctions';

export async function triggerWebhook(area: any, webhook: any) {
    const webhookType = area.webhook[0].type;

    const webhookValidator = webhookValidators[webhookType];

    if (!webhookValidator || !webhookValidator(webhook)) {
        console.error(`Request sent in webhook ${webhook._id} is not valid`);
        return;
    }

    const webhookFunction = webhookFunctions[webhookType];
    const reactionFunction = reactionsMap[area.reaction[0].type];

    if (!webhookFunction || !reactionFunction) {
        console.error(`Webhook ${webhook._id} or reaction ${area.reaction[0]._id} is not valid`);
        return;
    }

    return await reactionFunction({
        reactionObject: area.reaction[0],
        data: webhookFunction(webhook)
    });
}
