const express = require("express");
const app = express();
app.use = express.json();

const amqp = require("amqplib");
let channel;
let exchange = "order-publisher";

async function connectToRabbitMQ(callback) {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel();

    await channel.assertExchange(exchange, "fanout", {
      durable: true,
    });

    const q = await channel.assertQueue("", {
      exclusive: true,
    });

    await channel.bindQueue(q.queue, exchange);

    channel.consume(q.queue, (msg) => {
      if (msg !== null) {
        const data = msg.content.toString();
        callback(data);
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.log("Error connecting with rabbitMQ: ", err);
  }
}

module.exports = { connectToRabbitMQ };
