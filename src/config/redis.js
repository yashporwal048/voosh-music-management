import redis from 'redis';

const client = redis.createClient({
    url: 'redis://red-cu1um85svqrc73f0h25g:6379'
});

client.connect().catch(console.error);

client.on('connect',() => {
    console.log('Redis Connected')
})

client.on('error',(error) => {
    console.log('Error while connecting to Redis: ', error)
})

export default client;