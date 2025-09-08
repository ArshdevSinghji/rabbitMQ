const express = require("express");
const { connectToRabbitMQ } = require("./rabbitMQ");
const { processOrder } = require("./consumer");

const app = express();
app.use = express.json();

app.listen(3001, async () => {
  console.log("Connecting to rabbutMQ...");
  await connectToRabbitMQ(processOrder);
  console.log("Successfully connected!");
  console.log(`Server running on port 3001`);
});
