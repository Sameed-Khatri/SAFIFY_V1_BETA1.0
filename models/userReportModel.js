const db = require('../config/database');

const insertUserReport = async (reportDetails) => {
    try {
        const query = `CALL InsertUserReport(?, ?, ?, ?, ?, ?, ?)`;
        const results = await db.query(query,reportDetails);
        console.log(results);
        console.log(results[0][0][0].user_report_id);
        return results[0][0][0].user_report_id;
    } catch (error) {
        console.error('Error model inserting user report: ', error);
        throw error;
    }
};

const fetchUserReports = async (user_id) => {
    try {
        const query = `CALL GetUserReports(?)`;
        const results = await db.query(query,[user_id]);
        const data = results[0];
        return data[0];
    } catch (error) {
        console.error('Error model fetching user reports: ', error);
        throw error;
    }
};

const fetchUserScore = async (user) => {
    try {
        const query = `CALL getScore(?)`;
        const result = await db.query(query, user);
        return result[0][0];
    } catch (error) {
        console.error('Error model fetching user score: ', error);
        throw error;
    }
};

const fetchSubLocations = async (location_id) => {
    try {
        const query = `CALL GetSubLocations(?)`;
        const results = await db.query(query,[location_id]);
        const result2 = results[0];
        return result2[0];
    } catch (error) {
        console.error('Error model fetching sub locations: ', error);
        throw error;
    }
};

const fetchLocations = async () => {
    try {
        const query = `CALL GetLocations()`;
        const results = await db.query(query);
        const result2 = results[0];
        return result2[0];
    } catch (error) {
        console.error('Error model fetching locations: ', error);
        throw error;
    }
};

const fetchIncidentTypes = async () => {
    try {
        const query = `CALL GetIncidentTypes()`;
        const results = await db.query(query);
        const result2 = results[0];
        return result2[0];
    } catch (error) {
        console.error('Error model fetching incident types: ', error);
        throw error;
    }
};

const fetchIncidentSubTypes = async (incident_type_id) => {
    try {
        const query = `CALL GetIncidentSubTypes(?)`;
        const results = await db.query(query,[incident_type_id]);
        const result2 = results[0];
        return result2[0];
    } catch (error) {
        console.error('Error model fetching incident sub types: ', error);
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
        const adminsUserID = result[0][0];
        console.log(result[0][0]);
        return adminsUserID;
    } catch (error) {
        console.error('Error model fetching admin user id: ', error);
        throw error;
    }
};

const getLocationsAndSubLocations = async () => {
    try {
        const query = `CALL getLocationsAndSubLocations()`;
        const result = await db.query(query);
        console.log('check',result[0][0]);
        return result[0][0];
    } catch (error) {
        console.error('Error model fetching locations and sublocations: ', error);
        throw error;
    }
};

const getIncidetTypesAndIncidentSubTypes = async () => {
    try {
        const query = `CALL getIncidetTypesAndIncidentSubTypes()`;
        const result = await db.query(query);
        console.log(result[0][0]);
        return result[0][0];
    } catch (error) {
        console.error('Error model fetching incidet types and incident subtypes: ', error);
        throw error;
    }
};

module.exports = {
    insertUserReport,
    fetchUserReports,
    fetchUserScore,
    fetchSubLocations,
    fetchLocations,
    fetchIncidentTypes,
    fetchIncidentSubTypes,
    //fetchPushNotificationData,
    getAdminUserID,
    getLocationsAndSubLocations,
    getIncidetTypesAndIncidentSubTypes
};
