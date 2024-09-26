import client, { Connection, Channel } from "amqplib";
import { AreaDTO } from "../dtos/area.dto";
import { config } from "dotenv";

config();

export class RabbitMQConnection {
  connection!: Connection;
  channel!: Channel;
  private connected!: Boolean;
  private rmqQueue!: string;


  async connect() {
    if (this.connected && this.channel) return;

    const rmqUser = process.env.RMQ_USER;
    const rmqPass = process.env.RMQ_PASS;
    const rmqHost = process.env.RMQ_HOST;

    if (!rmqUser || !rmqPass || !rmqHost || !process.env.RMQ_QUEUE) {
      throw new Error(
        "RMQ_USER, RMQ_PASS, RMQ_HOST and RMQ_QUEUE must be defined in .env"
      );
    }

    this.rmqQueue = process.env.RMQ_QUEUE;

    console.log(`Connecting to Rabbit-MQ Server`);
    this.connection = await client.connect(
      `amqp://${rmqUser}:${rmqPass}@${rmqHost}:5672`
    );

    console.log(`Rabbit MQ Connection is ready`);

    this.channel = await this.connection.createChannel();
    this.connected = true;
    console.log(`Created RabbitMQ Channel successfully`);
  }

  async sendAreaToQueue(area: AreaDTO) {
    if (!this.channel) {
      console.log(`Channel not found, trying to create new channel..`);
      await this.connect();
    }
    this.channel.sendToQueue(this.rmqQueue, Buffer.from(JSON.stringify(area)));
  }

  async consumeArea(handleArea: (area: AreaDTO) => void) {
    await this.channel.assertQueue(this.rmqQueue, {
      durable: true,
    });

    this.channel.consume(
      this.rmqQueue,
      (msg: any) => {
        {
          if (!msg) {
            return console.error(`Invalid incoming message`);
          }
          try {
            const area: AreaDTO = JSON.parse(msg.content.toString());
            handleArea(area);
          } catch (error) {
            console.error(`Error in handling area: ${error}`);
          }
          this.channel.ack(msg);
        }
      },
      {
        noAck: false,
      }
    );
  }
}
