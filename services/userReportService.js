const userReportModel = require('../models/userReportModel');
const cloudinaryUtil = require('../middlewares/cloudinaryUtil');
const moment = require('moment');

const makeUserReport = async (reportData,file) => {
    try {
        const momentobj = moment(reportData.date_time, moment.ISO_8601);
        const mysqldatetime = momentobj.format('YYYY-MM-DD HH:mm:ss');
        let uploadedUrl = null;
        if (file) {
            const uploadResult = await cloudinaryUtil.uploadImage(file.buffer);
            uploadedUrl = uploadResult.url;
        }
        const reportDetails = [
            reportData.report_description,
            mysqldatetime,
            reportData.incident_subtype_id,
            reportData.sub_location_id,
            reportData.incident_criticality_id,
            uploadedUrl,
            reportData.user_id
        ];
        const userReportID = await userReportModel.insertUserReport(reportDetails);
        return userReportID;
    } catch (error) {
        console.error('Error service inserting user report: ', error);
        throw error;
    }
};

const fetchUserReports = async (user_id) => {
    try {
        return await userReportModel.fetchUserReports(user_id);
    } catch (error) {
        console.error('Error service fetching user reports: ', error);
        throw error;
    }
};

const fetchSubLocations = async (location_id) => {
    try {
        return await userReportModel.fetchSubLocations(location_id);
    } catch (error) {
        console.error('Error service fetching sub locations: ', error);
        throw error;
    }
};

const fetchLocations = async () => {
    try {
        return await userReportModel.fetchLocations();
    } catch (error) {
        console.error('Error service fetching locations: ', error);
        throw error;
    }
};

const fetchIncidentTypes = async () => {
    try {
        return await userReportModel.fetchIncidentTypes();
    } catch (error) {
        console.error('Error service fetching incident types: ', error);
        throw error;
    }
};

const fetchIncidentSubTypes = async (incident_type_id) => {
    try {
        return await userReportModel.fetchIncidentSubTypes(incident_type_id);
    } catch (error) {
        console.error('Error service fetching incident sub types: ', error);
        throw error;
    }
};

// const fetchPushNotificationData = async (user_id) => {
//     try {
//         return await userReportModel.fetchPushNotificationData(user_id);
//     } catch (error) {
//         console.error('Error service fetching push notification data: ', error);
//         throw error;
//     }
// };

const getAdminUserID = async () => {
    try {
        return await userReportModel.getAdminUserID();
    } catch (error) {
        console.error('Error service fetching admin user id: ', error);
        throw error;
    }
};

const getLocationsAndSubLocations = async () => {
    try {
        const results = await userReportModel.getLocationsAndSubLocations();
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
        const results = await userReportModel.getIncidetTypesAndIncidentSubTypes();
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
    makeUserReport,
    fetchUserReports,
    fetchSubLocations,
    fetchLocations,
    fetchIncidentTypes,
    fetchIncidentSubTypes,
    //fetchPushNotificationData,
    getAdminUserID,
    getLocationsAndSubLocations,
    getIncidetTypesAndIncidentSubTypes
};