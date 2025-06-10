const kafka = require("./client");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function init() {
  // 1. Initialize producer in a scope accessible to the event listeners
  const producer = kafka.producer();

  console.log("Connecting producer...");
  await producer.connect();
  console.log("Producer connected.");

  rl.setPrompt("> ");
  rl.prompt();

  rl.on("line", async function (line) {
    const [riderName, location] = line.split(" ");
    if (!riderName || !location) {
      console.log("Please provide both a rider name and a location.");
      rl.prompt();
      return;
    }

    try {
      await producer.send({
        topic: "rider-updates",
        messages: [
          {
            // 2. Ensure location is case-insensitive for partitioning
            partition: location.toLowerCase() === "north" ? 0 : 1,
            key: "location-update",
            value: JSON.stringify({
              name: riderName,
              location: location, // Corrected from 'loc' to 'location' for consistency
            }),
          },
        ],
      });
      console.log("Message sent successfully!");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
    rl.prompt();
  }).on("close", async () => {
    // 3. Disconnect the producer when the readline interface is closed
    console.log("Disconnecting producer...");
    await producer.disconnect();
    console.log("Producer disconnected.");
  });
}

init().catch((e) =>
  console.error("An error occurred during initialization:", e)
);
