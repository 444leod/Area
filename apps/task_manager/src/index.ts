import dotenv from "dotenv";
import {
  AreaPacket,
  RabbitMQService,
  MongoDBService,
} from "@area/shared";

dotenv.config();

const rabbitMQ = new RabbitMQService();
const mongoDB = new MongoDBService();

async function main() {
  await rabbitMQ.connect();
  await mongoDB.connect();

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
          ?.collection("users")
          .aggregate([
            { $unwind: "$area" },
            {
              $match: {
                "area.active": true,
                "area.action.isWebhook": false,
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
          user_id: obj._id,
          area: obj.area,
        };
        return areaPacket;
      });
    setInterval(async () => {
      if (await queueIsEmpty()) {
        groupAreaSend(await getFilteredRes());
      }
    }, 1000); // 1 sec between checks
  } catch (err) {
    console.error(err);
  } finally {
    await mongoDB.close();
  }
}

main().catch((err) => {
  console.error(err);
});
