const kafka = require("./client");
const group = process.argv[2];

async function init() {
  const consumer = await kafka.consumer({ groupId: "user-1" });

  await consumer.connect();

  await consumer.subscribe({ topic: "rider-updates", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        console.log(group)
      console.log(topic);
      console.log(partition);
      console.log({
        value: message.value.toString(),
      });
    },
  });
}

init();
