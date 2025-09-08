const express = require("express");
const { publishOrder } = require("./publisher");
const { connectToRabbitMQ } = require("./rabbitMQ");
const app = express();
app.use(express.json());

app.post("/order", (req, res) => {
  const order = req.body;
  publishOrder(order);
  res.json({
    message: "Order placed!",
    order,
  });
});

app.listen(3000, async () => {
  console.log("Connecting to rabbutMQ...");
  await connectToRabbitMQ();
  console.log("Successfully connected!");
  console.log(`Server running on port 3000`);
});
