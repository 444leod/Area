import { AreaPacket, RabbitMQService, MongoDBService } from '@area/shared';
import dotenv from 'dotenv';
import { actionsMap } from './actions/actions-map';
import { reactionsMap } from './reactions/reactions-map';

dotenv.config();

if (!process.env.RMQ_QUEUE) {
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

        rabbitMQ.consumeArea(process.env.RMQ_QUEUE || '', handleArea).then(() => {});

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
    const action_type = areaPacket?.area.action?.informations?.type;
    const reaction_type = areaPacket?.area.reaction?.informations?.type;

    if (!action_type || !reaction_type) {
        console.error('Action or reaction type not found.');
        return;
    }

    const actionFunction = actionsMap[action_type];
    if (!actionFunction) {
        console.error(`Action ${action_type} not supported.`);
        return;
    }
    const reactionFunction = reactionsMap[reaction_type];
    if (!reactionFunction) {
        console.error(`Reaction ${reaction_type} not supported.`);
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
