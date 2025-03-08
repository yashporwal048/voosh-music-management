import { consumeMessages } from "../config/kafka.js";

(async () => {
    await consumeMessages("test-topic");
})();