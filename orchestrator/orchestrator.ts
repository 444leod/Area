import * as amqp from "amqplib/callback_api";

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
        const msg = process.argv.slice(2).join(" ") || "Hello World!";

        channel.assertQueue(queue, {
          durable: true,
        });

        channel.sendToQueue(queue, Buffer.from(msg), {
          persistent: true,
        });

        console.log(" [x] Sent %s", msg);
      }
    );

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  }
);
