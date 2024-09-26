import client, { Connection, Channel } from "amqplib";
import { AreaDTO } from "../dtos/area.dto";

export class RabbitMQConnection {
  connection!: Connection;
  channel!: Channel;
  private connected!: Boolean;
  private queue!: string;

  async connect() {
    if (this.connected && this.channel) return;

    const rmqUser = process.env.RMQ_USER;
    const rmqPass = process.env.RMQ_PASS;
    const rmqhost = process.env.RMQ_HOST;

    if (!rmqUser || !rmqPass || !rmqhost) {
      throw new Error(
        "RMQ_USER, RMQ_PASS and RMQ_HOST must be defined in .env"
      );
    }

    console.log(`Connecting to Rabbit-MQ Server`);
    this.connection = await client.connect(
      `amqp://${rmqUser}:${rmqPass}@${rmqhost}:5672`
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
    this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(area)));
  }

  async consumeArea(handleArea: (area: AreaDTO) => void) {
    await this.channel.assertQueue(this.queue, {
      durable: true,
    });

    this.channel.consume(
      this.queue,
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
