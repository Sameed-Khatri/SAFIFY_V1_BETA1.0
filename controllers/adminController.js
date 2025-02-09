const adminService = require('../services/adminService');
const helper = require('../Helper/generateNotifications');
const middleware = require('../middlewares/passwordSecurity');
// const redisOperation = require('../middlewares/redisOperation');

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
        if (
            [req.query.department_id].some(
                (value) => value == null || value.trim() === '' || value === undefined || value === '-'
            )
        ) {
            return res.status(400).json({ status: 'Bad Request', message: 'Incorrect field values' });
        };

        const deptID = req.query.department_id;

        const actionTeams = await adminService.fetchAllActionTeams(deptID);
        if (actionTeams.length === 0) {
            return res.status(404).json({ status: 'Not Found', error: 'No action teams found for the given department' });
        };

        return res.status(200).json(actionTeams);
    } catch (error) {
        return res.status(500).json({status: 'Internal server error', error: error.message });
    }
};

const fetchAllActionTeamsWithDepartments = async (req, res) => {
    try {
        const actionTeams = await adminService.fetchAllActionTeamsWithDepartments();
        if (actionTeams.length === 0) {
            return res.status(404).json({ status: 'Not Found', error: 'No data found' });
        };

        return res.status(200).json(actionTeams);
    } catch (error) {
        return res.status(500).json({status: 'Internal server error', error: error.message });
    }
};

const InsertAssignTask = async (req, res) => {
    try {
        if (
            [req.body.user_report_id, req.body.user_id, req.body.action_team_id, req.body.incident_criticality_id].some(
                (value) => value == null || value.trim() === '' || value === undefined || value === '-'
            )
        ) {
            return res.status(400).json({ status: 'Bad Request', message: 'Incorrect field values' });
        };

        const user_report_id = req.body.user_report_id;
        const user_id = req.body.user_id;
        const action_team_id = req.body.action_team_id;
        const incident_criticality_id = req.body.incident_criticality_id;
        const relevant_instructions = req.body.relevant_instructions;

        const messageTitle1 = 'New Report Assigned';
        const messageBody1 = `New incident report (report number: ${user_report_id}) has been assigned.`;
        const messageTitle2 = 'Report Assigned To Team';
        const messageBody2 = `Your incident report (report number: ${user_report_id}) has been assigned. Thank you for making the work place safer!`;
        
        const actionTeamUserID = await adminService.getActionTeamUserIDFromActionTeamID(action_team_id);
        console.log(actionTeamUserID);
        
        const result = await adminService.InsertAssignTask(user_report_id, user_id, action_team_id, incident_criticality_id, relevant_instructions);
        if (result === 'DUPLICATE ENTRY') {
            return res.status(409).json({status: 'user report already assigned'});
        };

        const response1 = await helper.sendNotification(actionTeamUserID,messageTitle1,messageBody1);
        const response2 = await helper.sendNotification(user_id,messageTitle2,messageBody2);
        console.log(response1,response2);
        console.log(actionTeamUserID);

        return res.status(200).json({status: 'inserted in assigned task with updating criticality in user report'});
    } catch (error) {
        return res.status(500).json({status: 'Internal server error', error: error.message });
    }
};

const DeleteUserReport = async (req, res) => {
    try {
        if (
            [req.params.user_report_id].some(
                (value) => value == null || value.trim() === '' || value === undefined || value === '-'
            )
        ) {
            return res.status(400).json({ status: 'Bad Request', message: 'Incorrect field values' });
        };

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
        return res.status(500).json({status: 'Internal Server Error', error: error.message});
    }
};

const DeleteActionReport = async (req, res) => {
    try {
        if (
            [req.params.action_report_id].some(
                (value) => value == null || value.trim() === '' || value === undefined || value === '-'
            )
        ) {
            return res.status(400).json({ status: 'Bad Request', message: 'Incorrect field values' });
        };

        const action_report_id = req.params.action_report_id;
        const messageTitle = 'Report Rejected';
        const messageBody = `Your Report (report number: ${action_report_id}) was rejected.`;
        console.log('action_report_id: ', action_report_id);

        const userIDArray = await adminService.getUseridFromActionReportid(action_report_id);
        const output = userIDArray[0][0].userID;
        console.log('useridarray: ',userIDArray);
        console.log('output: ',output);

        const [userID, userReportUserID] = output.split(',');
        console.log('userID:', userID);
        console.log('userReportUserID:', userReportUserID);

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
        return res.status(500).json({status: 'Internal Server Error', error: error.message});
    }
};

const ApproveActionReport = async (req, res) => {
    try {
        if (
            [req.body.user_report_id, req.body.action_report_id].some(
                (value) => value == null || value.trim() === '' || value === undefined || value === '-'
            )
        ) {
            return res.status(400).json({ status: 'Bad Request', message: 'Incorrect field values' });
        };

        const user_report_id=req.body.user_report_id;
        const action_report_id=req.body.action_report_id;

        const messageTitle1 = 'Report Approved';
        const messageBody1 = `Your Report (report number: ${action_report_id}) was approved.`;
        const messageTitle2 = 'Report Resolved';
        const messageBody2 = `Your Report (report number: ${user_report_id}) was resolved. Thank you for making the work place safer!`;
        
        const actionTeamUserIDArray = await adminService.getUseridFromActionReportid(action_report_id);
        const output = actionTeamUserIDArray[0][0].userID;
        console.log('actionteamuseridarray: ',actionTeamUserIDArray);
        console.log('output: ',output);
        const [actionTeamUserID, userReportUserID] = output.split(',');
        console.log('actionteamUserID:', actionTeamUserID);
        console.log('userReportUserID:', userReportUserID);
        
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
        console.log(error.message);
        return res.status(500).json({status: 'Internal Server Error', error: error.message});
    }
};

const createUser = async (req, res) => {
    try {
        if (
            [req.body.user_id, req.body.role_name, req.body.user_name].some(
                (value) => value == null || value.trim() === '' || value === undefined || value === '-'
            )
        ) {
            return res.status(400).json({ status: 'Bad Request', message: 'Incorrect field values' });
        };
        
        let default_password = '123';
        const user_id = req.body.user_id;
        const role_name = req.body.role_name;
        const user_name = req.body.user_name;
        let department_id = null;

        if (req.body.user_pass && req.body.user_pass.trim() !== '' && req.body.user_pass !== '-') {
            default_password = req.body.user_pass;
        };

        if (role_name === 'action_team') {
            if (req.body.department_id) {
                department_id = req.body.department_id;
            } else {
                department_id = 'D1';
            };
        };

        const hashedPassword = await middleware.hashPassword(default_password);
        const result = await adminService.createUser(user_id, hashedPassword, role_name, user_name, department_id);
        console.log(result);

        return res.status(200).json({status: 'user created successfully'});
    } catch (error) {
        return res.status(500).json({status: 'Internal Server Error', error: error.message});
    }
};

const deleteUser = async (req, res) => {
    try {
        if (
            [req.body.user_id].some(
                (value) => value == null || value.trim() === '' || value === undefined || value === '-'
            )
        ) {
            return res.status(400).json({ status: 'Bad Request', message: 'Incorrect field values' });
        };

        await adminService.deleteUser([req.body.user_id]);

        return res.status(200).json({status: 'user deleted successfully'});
    } catch (error) {
        return res.status(500).json({status: 'Internal Server Error', error: error.message});
    }
};

const updateUser = async (req, res) => {
    try {
        if (
            [req.body.user_id, req.body.user_name, req.body.role_name].some(
                (value) => value == null || value.trim() === '' || value === undefined || value === '-'
            )
        ) {
            return res.status(400).json({ status: 'Bad Request', message: 'Incorrect field values' });
        };

        const user = [
            req.body.user_id,
            req.body.user_name,
            req.body.role_name
        ];

        await adminService.updateUser(user);

        return res.status(200).json({status: `User successfully updated`});
    } catch (error) {
        return res.status(500).json({status: 'Internal Server Error', error: error.message});
    }
};

const updateUserID = async (req, res) => {
    try {
        if (
            [req.body.user_id_old, req.body.user_id_new].some(
                (value) => value == null || value.trim() === '' || value === undefined || value === '-'
            )
        ) {
            return res.status(400).json({ status: 'Bad Request', message: 'Incorrect field values' });
        };

        const user = {
            user_id_old: req.body.user_id_old,
            user_id_new: req.body.user_id_new
        };

        await adminService.updateUserID(user);
        
        return res.status(200).json({status: `User successfully updated`});
    } catch (error) {
        return res.status(500).json({status: 'Internal Server Error', error: error.message});
    }
};

const generateAlert = async (req, res) => {
    try {
        if (
            [req.body.messageTitle, req.body.messageBody].some(
                (value) => value == null || value.trim() === '' || value === undefined || value === '-'
            )
        ) {
            return res.status(400).json({ status: 'Bad Request', message: 'Incorrect field values' });
        };

        const messageTitle = req.body.messageTitle;
        const messageBody = req.body.messageBody;
        const flagUserID = 'ALL';

        const response = await helper.sendNotification(flagUserID, messageTitle, messageBody);
        console.log(response);

        return res.status(200).json({status: 'Alert sent'});
    } catch (error) {
        return res.status(500).json({status: 'Internal Server Error', error: error.message});
    }
};

const addLocationOrSubLocation = async (req, res) => {
    try {
        const location_name = req.body.location_name;
        const sub_location_name = req.body.sub_location_name;
        const location_id = req.body.location_id;
        
        const flagUserID = 'ALL';
        let messageTitle;
        let messageBody;

        if (location_name && !sub_location_name && !location_id) {
            messageTitle = 'New Location';
            messageBody = 'New Location Has Been Added';
        } else if (!location_name && sub_location_name && location_id) {
            messageTitle = 'New Sub Location';
            messageBody = 'New Sub Location Has Been Added';
        } else {
            throw new Error('Invalid Parameters');
        }

        const response = await adminService.addLocationOrSubLocation(location_name, sub_location_name, location_id);
        console.log(response);

        await helper.sendNotification(flagUserID, messageTitle, messageBody, true);
        
        return res.status(200).json({status: 'New Location / Sub Location Added Successfully'});
    } catch (error) {
        return res.status(500).json({status: 'Internal Server Error', error: error.message});
    }
};

const addIncidentTypeOrSubType = async (req, res) => {
    try {
        const incident_type_description = req.body.incident_type_description;
        const incident_subtype_description = req.body.incident_subtype_description;
        const incident_type_id = req.body.incident_type_id;
        
        const flagUserID = 'ALL';
        let messageTitle;
        let messageBody;

        if (incident_type_description && !incident_subtype_description && !incident_type_id) {
            messageTitle = 'New Incident Type';
            messageBody = 'New Incident Type Has Been Added';
        } else if (!incident_type_description && incident_subtype_description && incident_type_id) {
            messageTitle = 'New Incident Sub Type';
            messageBody = 'New Incident Sub Type Has Been Added';
        } else {
            throw new Error('Invalid Parameters');
        }

        const response = await adminService.addIncidentTypeOrSubType(incident_type_description, incident_subtype_description, incident_type_id);
        console.log(response);

        await helper.sendNotification(flagUserID, messageTitle, messageBody, true);
        
        return res.status(200).json({status: 'New Incident Type / Sub Type Added Successfully'});
    } catch (error) {
        return res.status(500).json({status: 'Internal Server Error', error: error.message});
    }
};


// made these generic
const getLocationsAndSubLocations = async (req, res) => {
    try {
        const result = await adminService.getLocationsAndSubLocations();

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

const getIncidetTypesAndIncidentSubTypes = async (req, res) => {
    try {
        const result = await adminService.getIncidetTypesAndIncidentSubTypes();
        
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
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
    createUser,
    deleteUser,
    updateUser,
    updateUserID,
    fetchAllActionTeamsWithDepartments,
    generateAlert,
    addLocationOrSubLocation,
    addIncidentTypeOrSubType,
    getIncidetTypesAndIncidentSubTypes,
    getLocationsAndSubLocations
};