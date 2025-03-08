const { produceMessage } = require("../config/kafka.js");

const run = async() => {
    await produceMessage('test-topic', 'Hello from node.js');
    process.exit();
}

run();