const { createClient } = require('redis');

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

client.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
    await client.connect();
    console.log('Connected to Redis');
}

connectRedis().catch(console.error);

module.exports = client;
