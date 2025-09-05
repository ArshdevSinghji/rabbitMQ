const express = require("express");
const PORT = 3001;

const app = express();

app.use(express.json());

const amqp = require("amqplib");
var connect, channel;

const exchange = "exchange-1";
const type = "direct";

(async function connectToRabbitMQ() {
  try {
    connect = await amqp.connect("amqp://localhost:5672");
    channel = await connect.createChannel();

    channel.assertExchange(exchange, type, {
      durable: true,
    });

    const q = channel.assertQueue("", {
      exclusive: true,
    });

    channel.bindQueue(q.queue, exchange, "black");

    channel.consume(q.queue, (msg) => {
      console.log("message received: ", msg.content.toString());
      channel.ack(msg);
    });
  } catch (err) {
    console.log(err);
  }
})();

app.listen(PORT, () => console.log("Server running at port " + PORT));
