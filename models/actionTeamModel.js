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
        //const { reported_by, surrounding_image, report_description, question_one, question_two, question_three, question_four, question_five, resolution_description, proof_image, user_report_id, action_team_id } = reportDetails;
        const query = `CALL InsertActionReport(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const results = await db.query(query,reportDetails);
        console.log(results);
        console.log(results[0]);
        return results[0];
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

module.exports = {
    getActionTeamIdFromUserId,
    insertActionReport,
    fetchAssignedTasks
};