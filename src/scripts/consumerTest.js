const { consumeMessages } = require("../config/kafka.js");

(async () => {
    await consumeMessages("test-topic");
})();