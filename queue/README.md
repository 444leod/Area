How to launch the RabbitMQ server via a Docker container:

While in the queue directory, run the following commands:

```
docker build -t my-rabbitmq .
docker run -d --name rabbitmq-instance -p 5672:5672 -p 15672:15672 my-rabbitmq
```
