import { createClient } from 'redis';

const redisClient = createClient({
    url: 'redis://red-cu1um85svqrc73f0h25g:6379'
});

redisClient.connect().catch(console.error);

redisClient.on('connect', () => {
    console.log('Redis Connected');
});

redisClient.on('error', (error) => {
    console.log('Error while connecting to Redis: ', error);
});

const setAsync = async (key, ttl, value) => {
    try {
        await redisClient.setEx(key, ttl, value);
        console.log(`Key "${key}" set with TTL ${ttl}`);
    } catch (error) {
        console.error('Error setting key in Redis:', error);
    }
};

const delAsync = async (key) => {
    try {
        const result = await redisClient.del(key);
        console.log(`Key "${key}" deleted:`, result);
    } catch (error) {
        console.error('Error deleting key from Redis:', error);
    }
};

export { setAsync, delAsync, redisClient };