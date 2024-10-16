import client, { Channel, Connection } from 'amqplib';
import { AreaPacket, WebhookreaPacket } from '../dtos';

export class RabbitMQService {
  connection!: Connection;
  channel!: Channel;
  private connected: Boolean = false;

  async connect(): Promise<void> {
    if (this.connected && this.channel) return;

    const rmqUser = process.env.RMQ_USER;
    const rmqPass = process.env.RMQ_PASS;
    const rmqHost = process.env.RMQ_HOST;

    if (!rmqUser || !rmqPass || !rmqHost) {
      throw new Error(
        "RMQ_USER, RMQ_PASS, RMQ_HOST must be defined as environment variables"
      );
    }

    try {
      this.connection = await client.connect(
        `amqp://${rmqUser}:${rmqPass}@${rmqHost}:5672`
      );
    } catch (error: any) {
      switch (error?.code) {
        case 'ECONNREFUSED':
          throw new Error(`Connection refused to RabbitMQ: ${error}`);
        case 'ECONNRESET':
          throw new Error(`Connection reset to RabbitMQ: ${error}`);
        default:
          break;
      }
      throw new Error(`Error in connecting to RabbitMQ: ${error}`);
    }


    this.channel = await this.connection.createChannel();
    this.connected = true;
  }

  async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }

  async sendAreaToQueue(queue: string, area: AreaPacket | WebhookreaPacket): Promise<void> {
    if (!this.channel) {
      await this.connect();
    }
    await this.channel.assertQueue(queue, {
      durable: false,
    });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(area)));
  }

  async queueStats(queue: string): Promise<client.Replies.AssertQueue> {
    return await this.channel.checkQueue(queue);
  }

  async consumeArea(queue: string, handleArea: (area: AreaPacket) => void): Promise<void> {
    await this.channel.assertQueue(queue, {
      durable: false,
    });

    await this.channel.consume(
        queue,
      (msg: any) => {
        {
          if (!msg) {
            return console.error(`Invalid incoming message`);
          }
          try {
            const area: AreaPacket = JSON.parse(msg.content.toString());
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
