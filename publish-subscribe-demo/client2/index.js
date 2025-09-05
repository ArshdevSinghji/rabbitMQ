const express = require("express");

const PORT = 3002;

const app = express();
app.use(express.json());

const amqp = require("amqplib");
var channel, connection;

const exchange = "exchange-1";
const type = "direct";

(async function connectToRabbitMQ() {
  connection = await amqp.connect("amqp://localhost:5672");
  channel = await connection.createChannel();

  channel.assertExchange(exchange, type, {
    durable: true,
  });

  const q = channel.assertQueue("", {
    durable: true,
  });

  channel.bindQueue(q.queue, exchange, "orange");

  channel.consume(q.queue, (msg) => {
    console.log("message received: ", msg.content.toString());
    channel.ack(msg);
  });
})();

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
