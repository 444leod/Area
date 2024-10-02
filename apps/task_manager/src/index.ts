import dotenv from 'dotenv';
import { AreaPacket, RabbitMQService, MongoDBService } from '@area/shared';

dotenv.config();

const rabbitMQ = new RabbitMQService();
const mongoDB = new MongoDBService();
let numb = 1;

async function main() {
    await rabbitMQ.connect();
    await mongoDB.connect();
    console.log('Connected to RabbitMQ and MongoDB');

    const groupAreaSend = (areas: AreaPacket[]) => {
        areas.forEach((area) => {
            rabbitMQ.sendAreaToQueue(area);
        });
    };

    const queueIsEmpty = async () => {
        return (await rabbitMQ.queueStats()).messageCount == 0;
    };

    try {
        const myQuery = async (): Promise<any> => {
            return await mongoDB.executeWithSession(async () => {
                return await mongoDB
                    .db()
                    ?.collection('users')
                    .aggregate([
                        { $unwind: '$area' },
                        {
                            $match: {
                                'area.active': true,
                                'area.action.isWebhook': false,
                            },
                        },
                        {
                            $project: {
                                area: 1,
                            },
                        },
                    ])
                    .toArray();
            });
        };
        const getFilteredRes = async (): Promise<AreaPacket[]> =>
            (await myQuery()).map((obj: any) => {
                const areaPacket: AreaPacket = {
                    userId: obj._id,
                    area: obj.area,
                };
                return areaPacket;
            });
        setInterval(async () => {
            if (await queueIsEmpty()) {
                numb++;
                console.log(`Queue is empty, sending areas ${numb}`);
                groupAreaSend(await getFilteredRes());
            }
        }, 10000); // 1 sec between checks
    } catch (err) {
        console.error(err);
    } finally {
        await mongoDB.close();
    }
}

main().catch((err) => {
    console.error(err);
});
