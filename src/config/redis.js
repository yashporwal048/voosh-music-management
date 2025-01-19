import redis from 'redis';


const client = redis.createClient({
    url: 'redis://red-cu1um85svqrc73f0h25g:6379'
});

client.connect().catch(console.error);

client.on('connect', () => {
    console.log('Redis Connected')
})

client.on('error', (error) => {
    console.log('Error while connecting to Redis: ', error)
})
const setAsync = async (key, ttl, value) => {
    try {
        await client.setEx(key, ttl, value);
        console.log(`Key "${key}" set with TTL ${ttl}`);
    } catch (error) {
        console.error('Error setting key in Redis:', error);
    }
};

const delAsync = async (key) => {
    try {
        const result = await client.del(key);
        console.log(`Key "${key}" deleted:`, result);
    } catch (error) {
        console.error('Error deleting key from Redis:', error);
    }
};

export { setAsync, delAsync };