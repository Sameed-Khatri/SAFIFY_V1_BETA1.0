const db = require('../config/database');

const fetchAllUserReports = async (status1, status2) => {
    try {
        const query = `CALL GetAllUserReports(?, ?)`;
        const [results] = await db.query(query, [status1, status2]);
        return results[0];
    } catch (error) {
        console.error('Error fetching user reports: ', error);
        throw error;
    }
};

const fetchAllActionReports = async (status) => {
    try {
        const query = `CALL GetAllActionReports(?)`;
        const [results] = await db.query(query, [status]);
        return results[0];
    } catch (error) {
        console.error('Error fetching action reports: ', error);
        throw error;
    }
};

const fetchAllDepartments = async () => {
    try {
        const query = `CALL GetAllDepartments()`;
        const [results] = await db.query(query);
        return results[0];
    } catch (error) {
        console.error('Error fetching departments: ', error);
        throw error;
    }
};

const fetchAllActionTeams = async (deptID) => {
    try {
        const query = `CALL GetAllActionTeams(?)`;
        const [results] = await db.query(query,[deptID]);
        return results[0];
    } catch (error) {
        console.error('Error fetching action teams: ', error);
        throw error;
    }
};

const fetchAllActionTeamsWithDepartments = async () => {
    try {
        const query = `CALL GetAllActionTeamsWithDepartments()`;
        const [results] = await db.query(query);
        return results[0];
    } catch (error) {
        console.error('Error fetching action teams: ', error);
        throw error;
    }
};

const InsertAssignTask = async (user_report_id, user_id, action_team_id, incident_criticality_id, relevant_instructions) => {
    try {
        const query = `CALL InsertAssignTask(?, ?, ?, ?, ?)`;
        const [results] = await db.query(query,[user_report_id, user_id, action_team_id, incident_criticality_id, relevant_instructions]);
        console.log(results[0]);
        return results[0];
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.error('Duplicate entry error: ', error);
            return 'DUPLICATE ENTRY';
        } else {
            console.error('Error inserting in assigned task: ', error);
            throw error;
        }
    }
};

const DeleteUserReport = async (user_report_id) => {
    try {
        const query = `CALL DeleteUserReport(?)`;
        const results = await db.query(query,[user_report_id]);
        const affectedRows = results[0][0][0].affectedRows;
        return affectedRows;
    } catch (error) {
        console.error('Error deleting user report: ', error);
        throw error;
    }
};

const getUseridFromUserReportid = async (user_report_id) => {
    try {
        const qurey = `SELECT getUseridFromUserReportid(?) AS userID`;
        const userID = await db.query(qurey,[user_report_id]);
        return userID;
    } catch (error) {
        console.error('Error model fetching userid from user reportid: ', error);
        throw error;
    }
};

// const updateUserPushNotification = async (user_report_id, userID) => {
//     try {
//         const query = `CALL updateUserPushNotification(?, ?)`;
//         const result = await db.query(query,[user_report_id,userID]);
//         console.log(result);
//         console.log(result[0]);
//         const affectedRows = result[0][0][0].affectedRows;
//         console.log('affectedRows update: ',affectedRows);
//         return affectedRows;
//     } catch (error) {
//         console.error('Error model update User Push Notification: ', error);
//         throw error;
//     }
// };

const DeleteActionReport = async (action_report_id) => {
    try {
        const query = `CALL DeleteActionReport(?)`;
        const results = await db.query(query,[action_report_id]);
        const affectedRows = results[0][0][0].affectedRows;
        return affectedRows;
    } catch (error) {
        console.error('Error deleting action report: ', error);
        throw error;
    }
};

const getUseridFromActionReportid = async (action_report_id) => {
    try {
        const query = `SELECT getUseridFromActionReportid(?) AS userID`;
        const userID = await db.query(query,[action_report_id]);
        //console.log(userID);
        return userID;
    } catch (error) {
        console.error('Error model fetching userid from action reportid: ', error);
        throw error;
    }
};

// const updateActionTeamPushNotification = async (action_report_id,userID) => {
//     try {
//         const query = `CALL updateActionTeamPushNotification(?, ?)`;
//         const result = await db.query(query,[action_report_id,userID]);
//         console.log(result);
//         console.log(result[0]);
//         const affectedRows = result[0][0][0].affectedRows;
//         console.log('affectedRows update: ',affectedRows);
//         return affectedRows;
//     } catch (error) {
//         console.error('Error model update ActionTeam Push Notification: ', error);
//         throw error;
//     }
// };

const ApproveActionReport = async (user_report_id,action_report_id) => {
    try {
        const query = `CALL actionReportIDinAssignedTasks(?,?)`;
        const [results] = await db.query(query,[user_report_id,action_report_id]);
        return results[0];
    } catch (error) {
        console.error('Error approving action report: ', error);
        throw error;
    }
};

const getActionTeamUserIDFromActionTeamID = async (action_team_id) => {
    try {
        const query = `CALL getActionTeamUserIDFromActionTeamID(?)`;
        const result = await db.query(query, [action_team_id]);
        const userID = result[0][0];
        console.log(userID[0].user_id);
        return userID[0].user_id;
    } catch (error) {
        console.error('Error get ActionTeam UserID From ActionTeamID: ', error);
        throw error;
    }
};

const createUser = async (user_id, user_pass, role_name, user_name, department_id) => {
    try {
        const query = `CALL createUser(?, ?, ?, ?, ?)`;
        const result = await db.query(query,[user_id, user_pass, role_name, user_name, department_id]);
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error model create user: ', error);
        throw error;
    }
};

const addLocationOrSubLocation = async (flag, location_name, sub_location_name, location_id) => {
    try {
        const query = `CALL addLocationOrSubLocation(?, ?, ?, ?)`;
        const result = await db.query(query, [flag, location_name, sub_location_name, location_id]);
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error model add location or sub location: ', error);
        throw error;
    }
};

const addIncidentTypeOrSubType = async (flag, incident_type_description, incident_subtype_description, incident_type_id) => {
    try {
        const query = `CALL addIncidentTypeOrSubType(?, ?, ?, ?)`;
        const result = await db.query(query, [flag, incident_type_description, incident_subtype_description, incident_type_id]);
        console.log(result);
    } catch (error) {
        console.error('Error model add incident type or sub type: ', error);
        throw error;
    }
};

module.exports = {
    fetchAllUserReports,
    fetchAllActionReports,
    fetchAllDepartments,
    fetchAllActionTeams,
    InsertAssignTask,
    DeleteUserReport,
    DeleteActionReport,
    ApproveActionReport,
    getUseridFromActionReportid,
    //updateActionTeamPushNotification,
    getUseridFromUserReportid,
    //updateUserPushNotification,
    getActionTeamUserIDFromActionTeamID,
    createUser,
    fetchAllActionTeamsWithDepartments,
    addLocationOrSubLocation,
    addIncidentTypeOrSubType
};