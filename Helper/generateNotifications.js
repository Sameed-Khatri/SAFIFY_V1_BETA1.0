const db = require('../config/database');
const firebase = require('../config/firebaseConfig');

const fetchDeviceToken = async (user_id) => {
    try {
        const query = `CALL getDeviceTokenDB(?)`;
        const result = await db.query(query, [user_id]);
        const deviceToken = result[0][0][0].token;
        if(!deviceToken) {
            console.warn(`No device token for user ID: ${user_id}`);
            return null;
        };
        return deviceToken;
    } catch (error) {
        console.error('Error fetching device token: ', error);
        throw error;
    }
};

const removeInvalidToken = async (user_id) => {
    try {
        const query = `CALL removeInvalidDeviceToken(?)`;
        await db.query(query, [user_id]);
        console.log(`Set device token to NULL for user ID: ${user_id}`);
    } catch (error) {
        console.error('Error setting device token to NULL: ', error);
    }
};

const sendNotification = async (user_id, messageTitle, messageBody) => {
    try {
        const deviceToken = await fetchDeviceToken(user_id);
        if(!deviceToken) {
            console.warn(`Skipping notification for user ID: ${user_id} due to null or invalid device token`);
            return null;
        };

        const message = {
            token: deviceToken,
            notification: {
                title: messageTitle,
                body: messageBody,
            },
            android: {
                priority: "high",
                notification: {
                    title: messageTitle,
                    body: messageBody,
                    sound: "default",
                },
            },
            apns: {
                payload: {
                    aps: {
                        alert: {
                            title: messageTitle,
                            body: messageBody,
                        },
                        sound: "default",
                    },
                },
            },
        };
        console.log('Sending message:', message);
        const response = await firebase.messaging().send(message);
        console.log('Successfully sent message:', response);
        return response;
    } catch (error) {
        console.error('Error sending notification: ', error);
        if (error.errorInfo && error.errorInfo.code === 'messaging/registration-token-not-registered') {
            console.log(`Invalid registration token for user ID: ${user_id}`);
            await removeInvalidToken(user_id);
        }
        // Do not throw the error to avoid disrupting the caller
        // throw error;
    }
};

module.exports = {
    sendNotification
};