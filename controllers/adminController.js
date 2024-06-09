const adminService = require('../services/adminService');
const helper = require('../Helper/generateNotifications');

const fetchAllUserReports = async (req, res) => {
    try {
        const reports = await adminService.fetchAllUserReports();
        return res.status(200).json(reports);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

const fetchAllActionReports = async (req, res) => {
    try {
        const reports = await adminService.fetchAllActionReports();
        return res.status(200).json(reports);
    } catch (error) {
        return res.status(500).json({status: 'Internal server error', error: error.message });
    }
};

const fetchAllDepartments = async (req, res) => {
    try {
        const departments = await adminService.fetchAllDepartments();
        return res.status(200).json(departments);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

const fetchAllActionTeams = async (req, res) => {
    try {
        const deptID = req.query.department_id;
        if (!deptID) {
            return res.status(400).json({ status: 'Bad Request', error: 'Department ID is required' });
        }
        const actionTeams = await adminService.fetchAllActionTeams(deptID);
        if (actionTeams.length === 0) {
            return res.status(404).json({ status: 'Not Found', error: 'No action teams found for the given department' });
        }
        return res.status(200).json(actionTeams);
    } catch (error) {
        return res.status(500).json({status: 'Internal server error', error: error.message });
    }
};

const InsertAssignTask = async (req, res) => {
    try {
        const user_report_id=req.body.user_report_id;
        const user_id=req.body.user_id;
        const action_team_id=req.body.action_team_id;
        const incident_criticality_id=req.body.incident_criticality_id;
        const messageTitle1 = 'New Report Assigned';
        const messageBody1 = `New incident report (report number: ${user_report_id}) has been assigned.`;
        const messageTitle2 = 'Report Assigned To Team';
        const messageBody2 = `Your incident report (report number: ${user_report_id}) has been assigned. Thank you for making the work place safer!`;
        if (!user_report_id || !user_id || !incident_criticality_id || !action_team_id) {
            return res.status(400).json({ status: 'Bad Request', error: 'params incomplete' });
        }
        const actionTeamUserID = await adminService.getActionTeamUserIDFromActionTeamID(action_team_id);
        console.log(actionTeamUserID);
        const result = await adminService.InsertAssignTask(user_report_id, user_id, action_team_id, incident_criticality_id);
        if (result === 'DUPLICATE ENTRY') {
            return res.status(409).json({status: 'user report already assigned'});
        };
        const response1 = await helper.sendNotification(actionTeamUserID,messageTitle1,messageBody1);
        const response2 = await helper.sendNotification(user_id,messageTitle2,messageBody2);
        console.log(response1,response2);
        return res.status(200).json({status: 'inserted in assigned task with updating criticality in user report'});
    } catch (error) {
        return res.status(500).json({status: 'Internal server error', error: error.message });
    }
};

const DeleteUserReport = async (req, res) => {
    try {
        const user_report_id = req.params.user_report_id;
        const messageTitle = 'Report Rejected';
        const messageBody = `Your Report (report number: ${user_report_id}) was rejected.`;
        console.log('user_report_id', user_report_id);
        const userIDArray = await adminService.getUseridFromUserReportid(user_report_id);
        const userID = userIDArray[0][0].userID;
        if(!userID) {
            return res.status(404).json({ status: 'User ID Not Found' });
        };
        console.log('result user id:',userID);
        const result = await adminService.DeleteUserReport(user_report_id);
        if(result < 1) {
            return res.status(404).json({ status: 'No user report found with the given ID' });
        };
        if(result > 1) {
            return res.status(404).json({ status: 'More than 1 user report found with the given ID' });
        };
        console.log('result delete:',result);
        // const pushNotification = await adminService.updateUserPushNotification(user_report_id, userID);
        // if(pushNotification < 1) {
        //     return res.status(404).json({ status: 'No Push Notification Updated' });
        // };
        // if(pushNotification > 1) {
        //     return res.status(404).json({ status: 'More than 1 users with same user ID' });
        // };
        // console.log('result push notification:',pushNotification);
        const response = await helper.sendNotification(userID,messageTitle,messageBody);
        console.log(response);
        return res.status(200).json({status: 'deleted user report'});
    } catch (error) {
        return res.status(500).json({status: 'Internal Server Error'});
    }
};

const DeleteActionReport = async (req, res) => {
    try {
        const action_report_id = req.params.action_report_id;
        const messageTitle = 'Report Rejected';
        const messageBody = `Your Report (report number: ${action_report_id}) was rejected.`;
        console.log('action_report_id: ', action_report_id);
        const userIDArray = await adminService.getUseridFromActionReportid(action_report_id);
        const userID = userIDArray[0][0].userID;
        if(!userID) {
            return res.status(404).json({ status: 'User ID Not Found' });
        };
        console.log('result user id:',userID);
        const result = await adminService.DeleteActionReport(action_report_id);
        if(result < 1) {
            return res.status(404).json({ status: 'No action report found with the given ID' });
        };
        if(result > 1) {
            return res.status(404).json({ status: 'More than 1 action report found with the given ID' });
        };
        console.log('result delete:',result);
        // const pushNotification = await adminService.updateActionTeamPushNotification(action_report_id, userID);
        // if(pushNotification < 1) {
        //     return res.status(404).json({ status: 'No Push Notification Updated' });
        // };
        // if(pushNotification > 1) {
        //     return res.status(404).json({ status: 'More than 1 users with same user ID' });
        // };
        // console.log('result push notification:',pushNotification);
        const response = await helper.sendNotification(userID,messageTitle,messageBody);
        console.log(response);
        return res.status(200).json({status: 'deleted action report'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: 'Internal Server Error'});
    }
};

const ApproveActionReport = async (req, res) => {
    try {
        const user_report_id=req.body.user_report_id;
        const action_report_id=req.body.action_report_id;
        const messageTitle1 = 'Report Approved';
        const messageBody1 = `Your Report (report number: ${action_report_id}) was approved.`;
        const messageTitle2 = 'Report Resolved';
        const messageBody2 = `Your Report (report number: ${user_report_id}) was resolved. Thank you for making the work place safer!`;
        const actionTeamUserIDArray = await adminService.getUseridFromActionReportid(action_report_id);
        const actionTeamUserID = actionTeamUserIDArray[0][0].userID;
        if(!actionTeamUserID) {
            return res.status(404).json({ status: 'Action Team User ID Not Found' });
        };
        const userIDArray = await adminService.getUseridFromUserReportid(user_report_id);
        const userID = userIDArray[0][0].userID;
        if(!userID) {
            return res.status(404).json({ status: 'User ID Not Found' });
        };
        const result = await adminService.ApproveActionReport(user_report_id,action_report_id);
        const response1 = await helper.sendNotification(actionTeamUserID,messageTitle1,messageBody1);
        const response2 = await helper.sendNotification(userID,messageTitle2,messageBody2);
        console.log(response1,response2);
        return res.status(200).json({status: 'action report approved'});
    } catch (error) {
        return res.status(500).json({status: 'Internal Server Error'});
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
};