const adminService = require('../services/adminService');

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
        if (!user_report_id || !user_id || !incident_criticality_id || !action_team_id) {
            return res.status(400).json({ status: 'Bad Request', error: 'params incomplete' });
        }
        const result = await adminService.InsertAssignTask(user_report_id, user_id, action_team_id, incident_criticality_id);
        return res.status(200).json({status: 'inserted in assigned task with updating criticality in user report'});
    } catch (error) {
        return res.status(500).json({status: 'Internal server error', error: error.message });
    }
};

const DeleteUserReport = async (req, res) => {
    try {
        const user_report_id = req.params.user_report_id;
        const result = await adminService.DeleteUserReport(user_report_id);
        return res.status(200).json({status: 'deleted user report'});
    } catch (error) {
        return res.status(500).json({status: 'Internal Server Error'});
    }
};

const DeleteActionReport = async (req, res) => {
    try {
        const action_report_id = req.params.action_report_id;
        console.log('action_report_id: ', action_report_id);
        const userIDArray = await adminService.getUseridFromActionReportid(action_report_id);
        const userID = userIDArray[0][0].userID;
        if(!userID) {
            return res.status(404).json({ status: 'User ID Not Found' });
        };
        console.log('result user id:',userID);
        const result = await adminService.DeleteActionReport(action_report_id);
        if(result != 1) {
            return res.status(404).json({ status: 'No action report found with the given ID' });
        };
        console.log('result delete:',result);
        const pushNotification = await adminService.updateActionTeamPushNotification(action_report_id, userID);
        if(pushNotification != 1) {
            return res.status(404).json({ status: 'No Push Notification Updated' });
        };
        console.log('result push notification:',pushNotification);
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
        const result = await adminService.ApproveActionReport(user_report_id,action_report_id);
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