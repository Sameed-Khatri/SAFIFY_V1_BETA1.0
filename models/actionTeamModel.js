const db = require('../config/database');

const getActionTeamIdFromUserId = async (user_id) => {
    try {
        const query = 'SELECT getActionTeamIDfromUserID(?) AS action_team_id';
        const results = await db.query(query,[user_id]);
        const result2=results[0];
        console.log(result2[0]);
        return result2[0];
    } catch (error) {
        console.error('Error model fetching action team id from user id: ', error);
        throw error;
    }
};

const insertActionReport = async (reportDetails) => {
    try {
        console.log('MODEL');
        console.log(reportDetails);
        const query = `CALL InsertActionReport(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const results = await db.query(query,reportDetails);
        console.log(results);
        console.log(results[0][0][0].action_report_id);
        return results[0][0][0].action_report_id;
    } catch (error) {
        console.error('Error model inserting action report: ', error);
        throw error;
    }
};

const fetchAssignedTasks = async (action_team_id,status) => {
    try {
        const query = `CALL FetchAssignedTasks(?, ?)`;
        const results = await db.query(query,[action_team_id,status]);
        const result2=results[0];
        console.log(result2[0]);
        return result2[0];
    } catch (error) {
        console.error('Error model fetching assigned tasks: ', error);
        throw error;
    }
};

// const fetchPushNotificationData = async (user_id) => {
//     try {
//         const query = `CALL fetchPushNotificationData(?)`;
//         const data = await db.query(query,[user_id]);
//         const data2 = data[0];
//         return data2[0];
//     } catch (error) {
//         console.error('Error model fetching push notification data: ', error);
//         throw error;
//     }
// };

const getAdminUserID = async () => {
    try {
        const query = `CALL getAdminUserID()`;
        const result = await db.query(query);
        const adminUserID = result[0][0][0].user_id;
        return adminUserID;
    } catch (error) {
        console.error('Error model fetching admin user id: ', error);
        throw error;
    }
};

module.exports = {
    getActionTeamIdFromUserId,
    insertActionReport,
    fetchAssignedTasks,
    //fetchPushNotificationData,
    getAdminUserID
};