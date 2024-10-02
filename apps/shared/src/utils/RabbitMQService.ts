import client, { Channel, Connection } from 'amqplib';
import { Area } from '../dtos';

export class RabbitMQService {
  connection!: Connection;
  channel!: Channel;
  private connected: Boolean = false;
  private rmqQueue!: string;


  async connect(): Promise<void> {
    if (this.connected && this.channel) return;

    const rmqUser = process.env.RMQ_USER;
    const rmqPass = process.env.RMQ_PASS;
    const rmqHost = process.env.RMQ_HOST;

    if (!rmqUser || !rmqPass || !rmqHost || !process.env.RMQ_QUEUE) {
      throw new Error(
        "RMQ_USER, RMQ_PASS, RMQ_HOST and RMQ_QUEUE must be defined as environment variables"
      );
    }

    this.rmqQueue = process.env.RMQ_QUEUE;

    this.connection = await client.connect(
      `amqp://${rmqUser}:${rmqPass}@${rmqHost}:5672`
    );


    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.rmqQueue, {
      durable: false,
    });
    this.connected = true;
  }

  async sendAreaToQueue(area: Area): Promise<void> {
    if (!this.channel) {
      await this.connect();
    }
    this.channel.sendToQueue(this.rmqQueue, Buffer.from(JSON.stringify(area)));
  }

  async queueStats(): Promise<client.Replies.AssertQueue> {
    return await this.channel.checkQueue(this.rmqQueue);
  }

  async consumeArea(handleArea: (area: Area) => void): Promise<void> {
    await this.channel.assertQueue(this.rmqQueue, {
      durable: false,
    });

    await this.channel.consume(
      this.rmqQueue,
      (msg: any) => {
        {
          if (!msg) {
            return console.error(`Invalid incoming message`);
          }
          try {
            const area: Area = JSON.parse(msg.content.toString());
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