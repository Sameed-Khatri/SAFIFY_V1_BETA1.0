const analyticsService = require('../services/analyticsService');

const fetchIncidentsReported = async (req, res) => {
    try {
        const incidentCount = await analyticsService.fetchIncidentsReported();
        return res.status(200).send(incidentCount.toString());
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

const fetchIncidentsResolved = async (req, res) => {
    try {
        const incidentCount = await analyticsService.fetchIncidentsResolved();
        return res.status(200).send(incidentCount.toString());
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

const fetchTotalIncidentsOnTypes = async (req, res) => {
    try {
        const result = await analyticsService.fetchTotalIncidentsOnTypes();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

const fetchTotalIncidentsOnSubTypes = async (req, res) => {
    try {
        const result = await analyticsService.fetchTotalIncidentsOnSubTypes();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

const fetchTotalIncidentsOnLocations = async (req, res) => {
    try {
        const result = await analyticsService.fetchTotalIncidentsOnLocations();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

const fetchEfficiency = async (req, res) => {
    try {
        const result = await analyticsService.fetchEfficiency();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

const fetchAllAnalytics = async (req, res) => {
    try {
        const result = await analyticsService.fetchAllAnalytics();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

module.exports = {
    fetchIncidentsReported,
    fetchIncidentsResolved,
    fetchTotalIncidentsOnTypes,
    fetchTotalIncidentsOnSubTypes,
    fetchTotalIncidentsOnLocations,
    fetchEfficiency,
    fetchAllAnalytics
};
