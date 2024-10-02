import { AreaPacket, RabbitMQService, MongoDBService } from '@area/shared';
import dotenv from 'dotenv';
import { actionsMap } from './actions/actions-map';
import { reactionsMap } from './reactions/reactions-map';

dotenv.config();

const rabbitMQ = new RabbitMQService();
const mongoDB = new MongoDBService();

async function run() {
    try {
        await mongoDB.connect();
        await rabbitMQ.connect();

        const collections = await mongoDB.listCollections();

        if (collections.length === 0) {
            await mongoDB.createCollection('users'); // Wait for collection creation
        }

        rabbitMQ.consumeArea(handleArea).then(() => {});
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        await mongoDB.close();
    }
}

run().catch(console.dir);

async function handleArea(areaPacket: AreaPacket) {
    const actionType = areaPacket?.area.action?.informations?.type;
    const reactionType = areaPacket?.area.reaction?.informations?.type;

    if (!actionType || !reactionType) {
        throw new Error('Badly formed area.');
    }

    console.log(`Handling area with action ${actionType} and reaction ${reactionType}`);
    const actionFunction = actionsMap[actionType];
    if (!actionFunction) {
        throw new Error(`Action ${actionType} not supported.`);
    }
    const reactionFunction = reactionsMap[reactionType];
    if (!reactionFunction) {
        throw new Error(`Reaction ${reactionType} not supported.`);
    }

    const res = await actionFunction(areaPacket, mongoDB);

    if (!res) {
        return;
    }

    await reactionFunction(res, mongoDB);
}
