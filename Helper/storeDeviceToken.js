const db = require('../config/database');

const pushTokenDB = async (user_id, role_name, token) => {
    try {
        const query = `CALL pushTokenDB(?, ?, ?)`;
        const result = await db.query(query, [user_id,role_name,token]);
        const affectedRows = result[0][0][0].affectedRows;
        return affectedRows;
    } catch (error) {
        console.error('Error pushing device token: ', error);
        throw error;
    }
};

module.exports = {
    pushTokenDB
};