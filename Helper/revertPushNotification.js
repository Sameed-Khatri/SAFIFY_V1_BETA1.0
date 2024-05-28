const db = require('../config/database');

const revertPushNotification = async (user_id) => {
    try {
        const query = `CALL revertPushNotification(?)`;
        const result = await db.query(query,[user_id]);
        const affectedRows = result[0][0][0].affectedRows;
        return affectedRows;
    } catch (error) {
        console.error('Error model revert Push Notification: ', error);
        throw error;
    }
};

module.exports = {
    revertPushNotification
};