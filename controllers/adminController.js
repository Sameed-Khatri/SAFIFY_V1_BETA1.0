const adminService = require('../services/adminService');
const helper = require('../Helper/generateNotifications');
const middleware = require('../middlewares/passwordSecurity');
const redisOperation = require('../middlewares/redisOperation');

const fetchAllUserReports = async (req, res) => {
    try {
        // Check cache first
        const cacheKey = `userReportsAll`;
        const cachedData = await redisOperation.getCache(cacheKey);
        if (cachedData) {
            //console.log('data found in redis cache: ',cachedData);
            console.log('data found in redis cache: ');
            return res.status(200).json(cachedData);
        }

        const reports = await adminService.fetchAllUserReports();

        // Set cache
        console.log('setting data in redis cache');
        await redisOperation.setCache(cacheKey, reports);

        return res.status(200).json(reports);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

const fetchAllActionReports = async (req, res) => {
    try {
        // Check cache first
        const cacheKey = `actionReportsAll`;
        const cachedData = await redisOperation.getCache(cacheKey);
        if (cachedData) {
            console.log('data found in redis cache: ');
            return res.status(200).json(cachedData);
        }

        const reports = await adminService.fetchAllActionReports();

        // Set cache
        console.log('setting data in redis cache');
        await redisOperation.setCache(cacheKey, reports);
        
        return res.status(200).json(reports);
    } catch (error) {
        return res.status(500).json({status: 'Internal server error', error: error.message });
    }
};

const fetchAllDepartments = async (req, res) => {
    try {
        // Check cache first
        const cacheKey = `departments`;
        const cachedData = await redisOperation.getCache(cacheKey);
        if (cachedData) {
            console.log('data found in redis cache: ');
            return res.status(200).json(cachedData);
        }

        const departments = await adminService.fetchAllDepartments();

        // Set cache
        console.log('setting data in redis cache');
        await redisOperation.setCache(cacheKey, departments);

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

        // Check cache first
        const cacheKey = `allActionTeams:${deptID}`;
        const cachedData = await redisOperation.getCache(cacheKey);
        if (cachedData) {
            console.log('data found in redis cache: ');
            return res.status(200).json(cachedData);
        }

        const actionTeams = await adminService.fetchAllActionTeams(deptID);
        if (actionTeams.length === 0) {
            return res.status(404).json({ status: 'Not Found', error: 'No action teams found for the given department' });
        }

        // Set cache
        console.log('setting data in redis cache');
        await redisOperation.setCache(cacheKey, actionTeams);

        return res.status(200).json(actionTeams);
    } catch (error) {
        return res.status(500).json({status: 'Internal server error', error: error.message });
    }
};

const fetchAllActionTeamsWithDepartments = async (req, res) => {
    try {
        // Check cache first
        const cacheKey = `allActionTeamsWithDepartments:`;
        const cachedData = await redisOperation.getCache(cacheKey);
        if (cachedData) {
            console.log('data found in redis cache: ');
            return res.status(200).json(cachedData);
        }

        const actionTeams = await adminService.fetchAllActionTeamsWithDepartments();
        if (actionTeams.length === 0) {
            return res.status(404).json({ status: 'Not Found', error: 'No data found' });
        }

        // Set cache
        console.log('setting data in redis cache');
        await redisOperation.setCache(cacheKey, actionTeams);

        return res.status(200).json(actionTeams);
    } catch (error) {
        return res.status(500).json({status: 'Internal server error', error: error.message });
    }
};

const InsertAssignTask = async (req, res) => {
    try {
        const user_report_id = req.body.user_report_id;
        const user_id = req.body.user_id;
        const action_team_id = req.body.action_team_id;
        const incident_criticality_id = req.body.incident_criticality_id;
        const relevant_instructions = req.body.relevant_instructions;

        const messageTitle1 = 'New Report Assigned';
        const messageBody1 = `New incident report (report number: ${user_report_id}) has been assigned.`;
        const messageTitle2 = 'Report Assigned To Team';
        const messageBody2 = `Your incident report (report number: ${user_report_id}) has been assigned. Thank you for making the work place safer!`;
        
        if (!user_report_id || !user_id || !incident_criticality_id || !action_team_id) {
            return res.status(400).json({ status: 'Bad Request', error: 'params incomplete' });
        }
        
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
        
        // set relevant cache keys to null since data is being changed
        const cacheKey1 = `userReports:${user_id}`;
        await redisOperation.delCache(cacheKey1);

        const cacheKey2 = `userReportsAll`;
        await redisOperation.delCache(cacheKey2);

        const cacheKey3 = `assignedTasksActionTeam:${actionTeamUserID}`;
        await redisOperation.delCache(cacheKey3);

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
        
        // set relevant cache keys to null since data is being changed
        const cacheKey1 = `userReports:${userID}`;
        await redisOperation.delCache(cacheKey1);
 
        const cacheKey2 = `userReportsAll`;
        await redisOperation.delCache(cacheKey2);
        
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

        // set relevant cache keys to null since data is being changed
        const cacheKey1 = `actionReportsAll`;
        await redisOperation.delCache(cacheKey1);

        const cacheKey2 = `assignedTasksActionTeam:${userID}`;
        await redisOperation.delCache(cacheKey2);

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

        // set relevant cache keys to null since data is being changed
        const cacheKey1 = `userReports:${userID}`;
        await redisOperation.delCache(cacheKey1);
 
        const cacheKey2 = `userReportsAll`;
        await redisOperation.delCache(cacheKey2);

        const cacheKey3 = `actionReportsAll`;
        await redisOperation.delCache(cacheKey3);

        const cacheKey4 = `assignedTasksActionTeam:${actionTeamUserID}`;
        await redisOperation.delCache(cacheKey4);

        return res.status(200).json({status: 'action report approved'});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({status: 'Internal Server Error'});
    }
};

const createUser = async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const unhashedPassword = req.body.user_pass;
        const role_name = req.body.role_name;
        const user_name = req.body.user_name;
        let department_id = null;
        if (role_name === 'action_team') {
            department_id = req.body.department_id;
        };
        const hashedPassword = await middleware.hashPassword(unhashedPassword);
        const result = await adminService.createUser(user_id, hashedPassword, role_name, user_name, department_id);
        console.log(result);
        return res.status(200).json({status: 'user created successfully'});
    } catch (error) {
        return res.status(500).json({status: 'Internal Server Error'});
    }
};

const generateAlert = async (req, res) => {
    try {
        const messageTitle = req.body.messageTitle;
        const messageBody = req.body.messageBody;
        const flagUserID = 'ALL';

        const response = await helper.sendNotification(flagUserID, messageTitle, messageBody);
        console.log(response);

        return res.status(200).json({status: 'Alert sent'});
    } catch (error) {
        return res.status(500).json({status: 'Internal Server Error'});
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

        const cacheKey = `LocationsAndSubLocations:`;
        await redisOperation.delCache(cacheKey);
        
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
        
        const cacheKey = `IncidetTypesAndIncidentSubTypes:`;
        await redisOperation.delCache(cacheKey);
        
        return res.status(200).json({status: 'New Incident Type / Sub Type Added Successfully'});
    } catch (error) {
        return res.status(500).json({status: 'Internal Server Error', error: error.message});
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
    fetchAllActionTeamsWithDepartments,
    generateAlert,
    addLocationOrSubLocation,
    addIncidentTypeOrSubType
};