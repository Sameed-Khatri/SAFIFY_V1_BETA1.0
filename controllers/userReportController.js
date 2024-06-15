const userReportService = require('../services/userReportService');
const helper = require('../Helper/generateNotifications');
const redisOperation = require('../middlewares/redisOperation');

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
        const userReportID = await userReportService.makeUserReport(reportData,req.file);
        console.log(userReportID);
        const admins = await userReportService.getAdminUserID();
        console.log(admins);
        const messageTitle = 'New Incident Report Submitted';
        const messageBody = `New incident report (report number: ${userReportID}) has been submitted.`;
        for (const admin of admins) {
            console.log(admin);
            const response = await helper.sendNotification(admin.user_id,messageTitle,messageBody);
            console.log(response);
        };

        const cacheKey1 = `userReports:${req.params.userid}`;
        await redisOperation.delCache(cacheKey1);

        const cacheKey2 = `userReportsAll`;
        await redisOperation.delCache(cacheKey2);

        return res.status(200).json({status: 'report submitted'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: 'error inserting'});
    }
};

const fetchUserReports = async (req, res) => {
    try {
        const user_id = req.params.userid;

        // Check cache first
        const cacheKey = `userReports:${user_id}`;
        const cachedData = await redisOperation.getCache(cacheKey);
        if (cachedData) {
            console.log('data found in redis cache: ');
            return res.status(200).json(cachedData);
        }

        const reports = await userReportService.fetchUserReports(user_id);

        // Set cache
        console.log('setting data in redis cache');
        await redisOperation.setCache(cacheKey, reports);

        return res.status(200).json(reports);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

const fetchSubLocations = async (req, res) => {
    try {
        const location_id = req.query.location_id;

        // Check cache first
        const cacheKey = `subLocations:${location_id}`;
        const cachedData = await redisOperation.getCache(cacheKey);
        if (cachedData) {
            console.log('data found in redis cache: ');
            return res.status(200).json(cachedData);
        }

        const subLocations = await userReportService.fetchSubLocations(location_id);

        // Set cache
        console.log('setting data in redis cache');
        await redisOperation.setCache(cacheKey, subLocations);

        return res.status(200).json(subLocations);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

const fetchLocations = async (req, res) => {
    try {
        // Check cache first
        const cacheKey = `locations`;
        const cachedData = await redisOperation.getCache(cacheKey);
        if (cachedData) {
            console.log('data found in redis cache: ');
            return res.status(200).json(cachedData);
        }

        const locations = await userReportService.fetchLocations();

        // Set cache
        console.log('setting data in redis cache');
        await redisOperation.setCache(cacheKey, locations);

        return res.status(200).json(locations);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

const fetchIncidentTypes = async (req, res) => {
    try {
        // Check cache first
        const cacheKey = `incidentTypes`;
        const cachedData = await redisOperation.getCache(cacheKey);
        if (cachedData) {
            console.log('data found in redis cache: ');
            return res.status(200).json(cachedData);
        }

        const incidentTypes = await userReportService.fetchIncidentTypes();

        // Set cache
        console.log('setting data in redis cache');
        await redisOperation.setCache(cacheKey, incidentTypes);

        return res.status(200).json(incidentTypes);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

const fetchIncidentSubTypes = async (req, res) => {
    try {
        const incident_type_id=req.query.incident_type_id;

        // Check cache first
        const cacheKey = `incidentSubTypes:${incident_type_id}`;
        const cachedData = await redisOperation.getCache(cacheKey);
        if (cachedData) {
            console.log('data found in redis cache: ');
            return res.status(200).json(cachedData);
        }

        const incidentSubTypes = await userReportService.fetchIncidentSubTypes(incident_type_id);

        // Set cache
        console.log('setting data in redis cache');
        await redisOperation.setCache(cacheKey, incidentSubTypes);
        
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