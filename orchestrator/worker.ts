import * as amqp from "amqplib/callback_api";
import {RabbitMQConnection} from "@shared/utils/RabbitMQConnection";

amqp.connect(
  "amqp://localhost",
  (error0: amqp.Message | null, connection: amqp.Connection) => {
    if (error0) {
      throw error0;
    }
    connection.createChannel(
      (error1: amqp.Message | null, channel: amqp.Channel) => {
        if (error1) {
          throw error1;
        }

        const queue = "area_queue";

        channel.assertQueue(queue, {
          durable: true,
        });

        console.log(
          " [*] Waiting for messages in %s. To exit press CTRL+C",
          queue
        );

        channel.consume(
          queue,
          (msg: amqp.Message | null) => {
            const content = msg?.content.toString();
            console.log(" [x] Received area: %s", content);
            // Do the work here
            console.log(" [x] %s Done", content);
          },
          {
            noAck: true,
          }
        );
      }
    );
  }
);
