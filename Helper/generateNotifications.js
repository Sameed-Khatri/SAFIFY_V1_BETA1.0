const db = require('../config/database');
const firebase = require('../config/firebaseConfig');

const fetchDeviceToken = async (user_id) => {
    try {
        const query = `CALL getDeviceTokenDB(?)`;
        const result = await db.query(query, [user_id]);
        const deviceToken = result[0].token;
        if(!deviceToken) {
            throw new Error('No device toke for procided user ID');
        };
        return deviceToken;
    } catch (error) {
        console.error('Error fetching device token: ', error);
        throw error;
    }
};

const sendNotification = async (user_id, messageTitle, messageBody) => {
    try {
        const deviceToken = await fetchDeviceToken(user_id);
        if(!deviceToken) {
            throw new Error('No device toke for procided user ID');
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
        const response = await firebase.messaging().send(message);
        return response;
    } catch (error) {
        console.error('Error sending notification: ', error);
        throw error;
    }
};

module.exports = {
    sendNotification
};