import dotenv from 'dotenv';
import { AreaPacket, RabbitMQService, MongoDBService } from '@area/shared';

dotenv.config();

if (!process.env.RMQ_QUEUE) {
    throw new Error('RMQ_QUEUE must be defined as environment variable');
}

const rabbitMQ = new RabbitMQService();
const mongoDB = new MongoDBService();

let isRunning = true;
async function main() {
    await rabbitMQ.connect();
    await mongoDB.connect();

    const groupAreaSend = (areas: AreaPacket[]) => {
        areas.forEach((area) => {
            rabbitMQ.sendAreaToQueue(process.env.RMQ_QUEUE || '', area);
        });
    };

    const queueIsEmpty = async () => {
        return (await rabbitMQ.queueStats(process.env.RMQ_QUEUE || '')).messageCount == 0;
    };

    try {
        const myQuery = async (): Promise<any> => {
            return await mongoDB.executeWithSession(async () => {
                return await mongoDB
                    .db()
                    .collection('users')
                    .aggregate([
                        { $unwind: '$areas' },
                        {
                            $match: {
                                'areas.active': true,
                                'areas.action.is_webhook': false,
                            },
                        },
                        {
                            $project: {
                                areas: 1,
                                authorizations: 1,
                            },
                        },
                    ])
                    .toArray();
            });
        };
        const getFilteredRes = async (): Promise<AreaPacket[]> =>
            (await myQuery()).map((obj: any) => {
                const areaPacket: AreaPacket = {
                    user_id: obj._id,
                    area: obj.areas,
                    data: null,
                    authorizations: obj.authorizations,
                };
                return areaPacket;
            });

        const interval = setInterval(async () => {
            if (await queueIsEmpty()) {
                groupAreaSend(await getFilteredRes());
            }
        }, 1000); // 1 sec between checks

        process.on('SIGINT', async () => {
            clearInterval(interval);
            isRunning = false;
        });

        process.on('SIGTERM', async () => {
            clearInterval(interval);
            isRunning = false;
        });

        while (isRunning) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoDB.close();
        await rabbitMQ.close();
    }
}

main().catch((err) => {
    console.error(err);
});
