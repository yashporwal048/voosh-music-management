const redis = require('redis')

const client = redis.createClient({
    host: 'redis://red-cu1um85svqrc73f0h25g:6379',
    port : 6379
})

client.on('connect',() => {
    console.log('Redis Connected')
})

client.on('error',(error) => {
    console.log('Error while connecting to Redis: ', error)
})

module.exports = client;