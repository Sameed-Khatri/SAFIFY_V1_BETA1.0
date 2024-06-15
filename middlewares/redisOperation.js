const redisClient = require('../config/redis');

const getCache = async (key) => {
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        console.error('Redis GET error:', err);
        return null;
    }
};

const setCache = async (key, value, expiration = 1800) => {
    try {
        await redisClient.set(key, JSON.stringify(value), {
            EX: expiration,
        });
    } catch (err) {
        console.error('Redis SET error:', err);
    }
};

module.exports = {
    getCache,
    setCache,
};