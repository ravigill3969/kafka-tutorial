const kafka = require("./client");

async function init() {
  const admin = await kafka.admin();
  console.log("admin connecting");
  await admin.connect();
  console.log("admin connection successfull");

  console.log("creating topic rider-updates");
  await admin.createTopics({
    topics: [
      {
        topic: "rider-updates",
        numPartitions: 2,
      },
    ],
  });

  console.log("disconnecting admin");

  await admin.disconnect();
}

init();
