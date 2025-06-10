// client.js
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["10.0.0.161:9092"],
});

module.exports = kafka;
