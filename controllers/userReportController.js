const userReportService = require('../services/userReportService');

const makeUserReport = async (req, res) => {
    try {
        const reportData = {
            report_description: req.body.report_description,
            date_time: req.body.date_time,
            incident_subtype_id: req.body.incident_subtype_id,
            sub_location_id: req.body.sub_location_id,
            incident_criticality_id: req.body.incident_criticality_id,
            user_id: req.params.userid
        };
        const result = await userReportService.makeUserReport(reportData,req.file);
        console.log(result);
        return res.status(200).json({status: 'report submitted'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: 'error inserting'});
    }
};

const fetchUserReports = async (req, res) => {
    try {
        const user_id = req.params.userid;
        const reports = await userReportService.fetchUserReports(user_id);
        return res.status(200).json(reports);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

const fetchSubLocations = async (req, res) => {
    try {
        const location_id = req.query.location_id;
        const subLocations = await userReportService.fetchSubLocations(location_id);
        return res.status(200).json(subLocations);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

const fetchLocations = async (req, res) => {
    try {
        const locations = await userReportService.fetchLocations();
        return res.status(200).json(locations);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

const fetchIncidentTypes = async (req, res) => {
    try {
        const incidentTypes = await userReportService.fetchIncidentTypes();
        return res.status(200).json(incidentTypes);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

const fetchIncidentSubTypes = async (req, res) => {
    try {
        const incident_type_id=req.query.incident_type_id;
        const incidentSubTypes = await userReportService.fetchIncidentSubTypes(incident_type_id);
        return res.status(200).json(incidentSubTypes);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

module.exports = {
    makeUserReport,
    fetchUserReports,
    fetchSubLocations,
    fetchLocations,
    fetchIncidentTypes,
    fetchIncidentSubTypes
};