const adminModel = require('../models/adminModel');

const fetchAllUserReports = async () => {
    try {
        const status1='open';
        const status2='in progress';
        return await adminModel.fetchAllUserReports(status1,status2);
    } catch (error) {
        console.error('Error service fetching user reports: ', error);
        throw error;
    }
};

const fetchAllActionReports = async () => {
    try {
        const status='approval pending';
        return await adminModel.fetchAllActionReports(status);
    } catch (error) {
        console.error('Error service fetching action reports: ', error);
        throw error;
    }
};

const fetchAllDepartments = async () => {
    try {
        return await adminModel.fetchAllDepartments();
    } catch (error) {
        console.error('Error service fetching departments: ', error);
        throw error;
    }
};

const fetchAllActionTeams = async (deptID) => {
    try {
        return await adminModel.fetchAllActionTeams(deptID);
    } catch (error) {
        console.error('Error service fetching action teams: ', error);
        throw error;
    }
};

const InsertAssignTask = async (user_report_id, user_id, action_team_id, incident_criticality_id) => {
    try {
        return await adminModel.InsertAssignTask(user_report_id, user_id, action_team_id, incident_criticality_id);
    } catch (error) {
        console.error('Error service inserting in assigned task: ', error);
        throw error;
    }
};

const DeleteUserReport = async (user_report_id) => {
    try {
        return await adminModel.DeleteUserReport(user_report_id);
    } catch (error) {
        console.error('Error service deleting user report: ', error);
        throw error;
    }
};

const DeleteActionReport = async (action_report_id) => {
    try {
        return await adminModel.DeleteActionReport(action_report_id);
    } catch (error) {
        console.error('Error service deleting action report: ', error);
        throw error;
    }
};

const ApproveActionReport = async (user_report_id,action_report_id) => {
    try {
        return await adminModel.ApproveActionReport(user_report_id,action_report_id);
    } catch (error) {
        console.error('Error service approving action report: ', error);
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
    ApproveActionReport
}