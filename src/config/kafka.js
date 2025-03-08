import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'music-library',
    brokers: ['localhost:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'music-library-group' });

const produceMessage = async (topic, message) => {
    await producer.connect();
    await producer.send({
        topic,
        messages: [{ value: message }]
    });
    console.log('Published message to kafka');
};

const consumeMessages = async (topic) => {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`Received message from ${topic} for partition ${partition}`, message.value.toString());
            const eventData = JSON.parse(message?.value?.toString());

            if (eventData.event === 'New Album Added') {
                console.log(`New Album Added: ${eventData.album}`);
            }
        }
    });
};

export { producer, consumer, produceMessage, kafka, consumeMessages };