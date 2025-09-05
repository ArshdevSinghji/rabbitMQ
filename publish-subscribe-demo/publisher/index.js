const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

const amqp = require("amqplib");
var channel, connection;

const exchange = "exchange-1";
const type = "direct";

(async function connectQueue() {
  try {
    connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel();
    await channel.assertExchange(exchange, type, {
      durable: true,
    });
  } catch (err) {
    console.log(err);
  }
})();

const sendMessageToQueue = async (message) => {
  await channel.publish(exchange, "orange", Buffer.from(message));
};

app.get("/send-msg", (req, res) => {
  const message = "Hello World!";
  sendMessageToQueue(message);
  console.log("Message sent successfully!");
  res.send("Message Sent!");
});

app.listen(PORT, () => console.log(`Server started at ${PORT}`));
