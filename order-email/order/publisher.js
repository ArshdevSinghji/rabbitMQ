const { publishMessageToQueue } = require("./rabbitMQ");

function publishOrder(order) {
  publishMessageToQueue(order);
}

module.exports = { publishOrder };
