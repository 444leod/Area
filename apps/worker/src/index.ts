import { AreaPacket, RabbitMQService, MongoDBService, WebhookreaPacket } from '@area/shared';
import dotenv from 'dotenv';
import { actionsMap } from './actions/actions-map';
import { reactionsMap } from './reactions/reactions-map';

dotenv.config();

if (!process.env.RMQ_AREA_QUEUE || !process.env.RMQ_WEBH_QUEUE) {
    throw new Error('RMQ_QUEUE must be defined as environment variable');
}

const rabbitMQ = new RabbitMQService();
const mongoDB = new MongoDBService();

let isRunning = true;

async function run() {
    try {
        await mongoDB.connect();
        await rabbitMQ.connect();

        const collections = await mongoDB.listCollections();

        if (collections.length === 0) {
            await mongoDB.createCollection('users'); // Wait for collection creation
        }

        const areaQueueStress = (await rabbitMQ.queueStats(process.env.RMQ_AREA_QUEUE || '')).messageCount;
        const webhQueueStress = (await rabbitMQ.queueStats(process.env.RMQ_WEBH_QUEUE || '')).messageCount;

        if (areaQueueStress >= webhQueueStress)
            rabbitMQ.consumeMessage(process.env.RMQ_AREA_QUEUE || '', handleArea).then(() => {});
        else
            rabbitMQ.consumeMessage(process.env.RMQ_WEBH_QUEUE || '', handleWebhookrea).then(() => {});

        process.on('SIGINT', async () => {
            isRunning = false;
        });

        process.on('SIGTERM', async () => {
            isRunning = false;
        });

        while (isRunning) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    } catch (error) {
        console.error('Something went wrong: ', error);
    } finally {
        await rabbitMQ.close();
        await mongoDB.close();
    }
}

run().catch(console.dir);

async function handleArea(areaPacket: AreaPacket) {
    const actionType = areaPacket?.area.action?.informations?.type;
    const reactionType = areaPacket?.area.reaction?.informations?.type;

    if (!actionType || !reactionType) {
        console.error('Action or reaction type not found.');
        return;
    }

    const actionFunction = actionsMap[actionType];
    if (!actionFunction) {
        console.error(`Action ${actionType} not supported.`);
        return;
    }
    const reactionFunction = reactionsMap[reactionType];
    if (!reactionFunction) {
        console.error(`Reaction ${reactionType} not supported.`);
        return;
    }

    console.log(`Handling area: ${areaPacket.area.action.informations.type} -> ${areaPacket.area.reaction.informations.type}`);

    const res = await actionFunction(areaPacket, mongoDB);

    if (!res) {
        return;
    }

    console.log(`Action ${areaPacket.area.action.informations.type} executed successfully (id: ${res.area._id})`);

    await reactionFunction(res, mongoDB);
}

async function handleWebhookrea(packet: WebhookreaPacket)
{
    const reactionType = packet?.area?.reaction?.informations?.type;

    if (!reactionType) {
        console.error('Reaction type not found.');
        return;
    }

    const reactionFunction = reactionsMap[reactionType];
    if (!reactionFunction) {
        console.error(`Reaction ${reactionType} not supported`);
        return;
    }

    //const res = await reactionFunction(packet, mongoDB);
    console.log(packet)
}
