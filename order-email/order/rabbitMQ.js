const express = require("express");
const app = express();
app.use(express.json());

const amqp = require("amqplib");
let channel;
let exchange = "order-publisher";

async function connectToRabbitMQ() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel();

    await channel.assertExchange(exchange, "fanout", {
      durable: true,
    });
  } catch (err) {
    console.log("Error connecting with rabbitMQ: ", err);
  }
}

async function publishMessageToQueue(message) {
  try {
    await channel.publish(exchange, "", Buffer.from(JSON.stringify(message)), {
      persistant: true,
    });
  } catch (err) {
    console.log("Couldn't publish the message: ", err);
  }
}

module.exports = { connectToRabbitMQ, publishMessageToQueue };
