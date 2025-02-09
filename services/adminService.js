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

const fetchAllActionTeamsWithDepartments = async () => {
    try {
        return await adminModel.fetchAllActionTeamsWithDepartments();
    } catch (error) {
        console.error('Error service fetching action teams: ', error);
        throw error;
    }
};

const InsertAssignTask = async (user_report_id, user_id, action_team_id, incident_criticality_id, relevant_instructions) => {
    try {
        return await adminModel.InsertAssignTask(user_report_id, user_id, action_team_id, incident_criticality_id, relevant_instructions);
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

const getUseridFromUserReportid = async (user_report_id) => {
    try {
        return await adminModel.getUseridFromUserReportid(user_report_id);
    } catch (error) {
        console.error('Error service fetching userid from user reportid: ', error);
        throw error;
    }
};

// const updateUserPushNotification = async (user_report_id,userID) => {
//     try {
//         return await adminModel.updateUserPushNotification(user_report_id,userID);
//     } catch (error) {
//         console.error('Error service update User Push Notification: ', error);
//         throw error;
//     }
// };

const DeleteActionReport = async (action_report_id) => {
    try {
        return await adminModel.DeleteActionReport(action_report_id);
    } catch (error) {
        console.error('Error service deleting action report: ', error);
        throw error;
    }
};

const getUseridFromActionReportid = async (action_report_id) => {
    try {
        return await adminModel.getUseridFromActionReportid(action_report_id);
    } catch (error) {
        console.error('Error service fetching userid from action reportid: ', error);
        throw error;
    }
};

// const updateActionTeamPushNotification = async (action_report_id,userID) => {
//     try {
//         return await adminModel.updateActionTeamPushNotification(action_report_id,userID);
//     } catch (error) {
//         console.error('Error service update ActionTeam Push Notification: ', error);
//         throw error;
//     }
// };

const ApproveActionReport = async (user_report_id,action_report_id) => {
    try {
        return await adminModel.ApproveActionReport(user_report_id,action_report_id);
    } catch (error) {
        console.error('Error service approving action report: ', error);
        throw error;
    }
};

const getActionTeamUserIDFromActionTeamID = async (action_team_id) => {
    try {
        return await adminModel.getActionTeamUserIDFromActionTeamID(action_team_id);
    } catch (error) {
        console.error('Error service get ActionTeam UserID From ActionTeamID: ', error);
        throw error;
    }
};

const createUser = async (user_id, user_pass, role_name, user_name, department_id) => {
    try {
        return await adminModel.createUser(user_id, user_pass, role_name, user_name, department_id);
    } catch (error) {
        console.error('Error service create user: ', error);
        throw error;
    }
};

const deleteUser = async (user) => {
    try {
        return await adminModel.deleteUser(user);
    } catch (error) {
        console.error('Error service delete user: ', error);
        throw error;
    }
};

const addLocationOrSubLocation = async (location_name, sub_location_name, location_id) => {
    try {
        let flag;

        if (location_name && !sub_location_name && !location_id) {
            flag = 0;
        } else if (!location_name && sub_location_name && location_id) {
            flag = 1;
        } else {
            throw new Error('Invalid Parameters');
        }

        const response = await adminModel.addLocationOrSubLocation(flag, location_name, sub_location_name, location_id);
        
        return response;
    } catch (error) {
        console.error('Error service add location or sub location: ', error);
        throw error;
    }
};

const addIncidentTypeOrSubType = async (incident_type_description, incident_subtype_description, incident_type_id) => {
    try {
        let flag;

        if (incident_type_description && !incident_subtype_description && !incident_type_id) {
            flag = 0;
        } else if (!incident_type_description && incident_subtype_description && incident_type_id) {
            flag = 1;
        } else {
            throw new Error('Invalid Parameters');
        }

        const response = await adminModel.addIncidentTypeOrSubType(flag, incident_type_description, incident_subtype_description, incident_type_id);
        
        return response;
    } catch (error) {
        console.error('Error service add incident type or sub type: ', error);
        throw error;
    }
};

const getLocationsAndSubLocations = async () => {
    try {
        const results = await adminModel.getLocationsAndSubLocations();
        const locations ={};

        results.forEach(row => {
            const {location_id, location_name, sub_location_id, sub_location_name} = row;
            
            if (!locations[location_id]) {
                locations[location_id] = {
                    location_id,
                    location_name,
                    sub_locations: []
                };
            };

            locations[location_id].sub_locations.push({
                sub_location_id,
                sub_location_name
            });
        });

        const response = {
            locations: Object.values(locations)
        };

        return response;
    } catch (error) {
        console.error('Error service fetching locations and sublocations: ', error);
        throw error;
    }
};

const getIncidetTypesAndIncidentSubTypes = async () => {
    try {
        const results = await adminModel.getIncidetTypesAndIncidentSubTypes();
        const incidentTypes = {};

        results.forEach(row => {
            const {incident_type_id, incident_type_description, incident_subtype_id, incident_subtype_description} = row;

            if(!incidentTypes[incident_type_id]) {
                incidentTypes[incident_type_id] = {
                    incident_type_id,
                    incident_type_description,
                    incident_subtypes: []
                };
            };

            incidentTypes[incident_type_id].incident_subtypes.push({
                incident_subtype_id,
                incident_subtype_description
            });
        });

        const response = {
            incidentTypes: Object.values(incidentTypes)
        };

        return response;
    } catch (error) {
        console.error('Error service fetching incidet types and incident subtypes: ', error);
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
    deleteUser,
    fetchAllActionTeamsWithDepartments,
    addLocationOrSubLocation,
    addIncidentTypeOrSubType,
    getLocationsAndSubLocations,
    getIncidetTypesAndIncidentSubTypes
};