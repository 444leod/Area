import { Area, AreaPacket, RabbitMQService, MongoDBService } from '@area/shared';
import dotenv from 'dotenv';
import { actionsMap } from './actions/actionsMap';
import { reactionsMap } from './reactions/reactionsMap';

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
    const actionType = areaPacket.area.action?.informations?.type;
    const reactionType = areaPacket.area.reaction?.informations?.type;

    if (!actionType || !reactionType) {
        throw new Error('Badly formed area.');
    }

    const actionFunction = actionsMap[actionType];
    if (!actionFunction) {
        throw new Error(`Action ${actionType} not supported.`);
    }
    const reactionFunction = reactionsMap[reactionType];
    if (!reactionFunction) {
        throw new Error(`Reaction ${reactionType} not supported.`);
    }

    const res = await actionFunction(areaPacket.area, mongoDB);

    if (!res) {
        return;
    }

    await reactionFunction(res, mongoDB);
}
